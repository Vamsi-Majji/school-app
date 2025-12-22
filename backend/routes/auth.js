const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const auth = require("../middleware/auth");

const upload = multer({ dest: "uploads/" });

// POST /login
router.post("/login", async (req, res) => {
  try {
    // trim incoming credentials
    const usernameOrEmail = (req.body.username || req.body.email || "").trim();
    const password = (req.body.password || "").trim();
    const selectedRole = (req.body.role || "").trim();

    // log for debugging (do NOT log raw password in production)
    console.log(
      "Login attempt for:",
      usernameOrEmail,
      "passwordLength:",
      password.length,
      "selectedRole:",
      selectedRole
    );

    if (!usernameOrEmail || !password || !selectedRole) {
      return res.status(400).json({ message: "Missing credentials or role" });
    }

    const usersPath = path.join(__dirname, "..", "data", "users.json");
    let raw = fs.readFileSync(usersPath, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    const users = JSON.parse(raw);

    const user = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === usernameOrEmail.toLowerCase()) ||
        (u.username &&
          u.username.toLowerCase() === usernameOrEmail.toLowerCase())
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // if stored password looks like bcrypt hash, use bcrypt.compare
    const stored = user.password || "";
    let ok = false;
    if (stored.startsWith("$2")) {
      ok = await bcrypt.compare(password, stored);
    } else {
      // fallback for local dev seeded plaintext passwords
      ok = password === stored;
    }

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (user.approved === false) {
      return res.status(403).json({ message: "User not approved" });
    }

    // Check if selected role matches user's actual role
    if (user.role !== selectedRole) {
      return res
        .status(401)
        .json({ message: "Role mismatch. Please select the correct role." });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        schoolName: user.schoolName,
      },
      "secretkey",
      { expiresIn: "24h" }
    );

    // don't leak password
    const { password: _p, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err) {
    // improved error logging for debugging
    console.error("Login error:", err.stack || err, "requestBody:", {
      usernameOrEmail: req && req.body && (req.body.username || req.body.email),
      passwordLength:
        req && req.body && req.body.password ? req.body.password.length : 0,
    });
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /signup
router.post(
  "/signup",
  upload.fields([
    { name: "documents", maxCount: 10 },
    { name: "parentDocuments", maxCount: 10 },
    { name: "experienceDocuments", maxCount: 10 },
    { name: "educationDocuments", maxCount: 10 },
    { name: "otherDocuments", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const formData = req.body;
      const files = req.files;

      // Validate required fields
      if (
        !formData.email ||
        !formData.password ||
        !formData.role ||
        !formData.school
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user already exists
      const usersPath = path.join(__dirname, "..", "data", "users.json");
      let users = [];
      if (fs.existsSync(usersPath)) {
        const raw = fs.readFileSync(usersPath, "utf8");
        users = JSON.parse(raw);
      }

      const existingUser = users.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // Generate new user ID
      const newUserId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

      // Prepare user data
      const userData = {
        id: newUserId,
        username: formData.email,
        email: formData.email,
        password: hashedPassword,
        role: formData.role,
        schoolName: formData.school,
        firstName: formData.firstName,
        lastName: formData.lastName,
        approved: false,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Add role-specific data
      if (formData.role === "student") {
        userData.parentEmail = formData.parentEmail;
        if (files.educationDocuments) {
          userData.educationDocuments = files.educationDocuments.map(
            (f) => f.filename
          );
        }
        if (files.otherDocuments) {
          userData.otherDocuments = files.otherDocuments.map((f) => f.filename);
        }
      } else if (formData.role === "principal") {
        userData.schoolDescription = formData.schoolDescription;
        if (files.documents) {
          userData.documents = files.documents.map((f) => f.filename);
        }
      } else if (formData.role === "teacher") {
        userData.subjectGroup = formData.subjectGroup;
        userData.subjectsToTeach = formData.subjectsToTeach
          ? formData.subjectsToTeach.split(",")
          : [];
        if (files.experienceDocuments) {
          userData.experienceDocuments = files.experienceDocuments.map(
            (f) => f.filename
          );
        }
        if (files.educationDocuments) {
          userData.educationDocuments = files.educationDocuments.map(
            (f) => f.filename
          );
        }
        if (files.otherDocuments) {
          userData.otherDocuments = files.otherDocuments.map((f) => f.filename);
        }
      } else if (["attender", "maid"].includes(formData.role)) {
        if (files.experienceDocuments) {
          userData.experienceDocuments = files.experienceDocuments.map(
            (f) => f.filename
          );
        }
        if (files.educationDocuments) {
          userData.educationDocuments = files.educationDocuments.map(
            (f) => f.filename
          );
        }
        if (files.otherDocuments) {
          userData.otherDocuments = files.otherDocuments.map((f) => f.filename);
        }
      }

      // Add user to users array
      users.push(userData);

      // If student, create parent account
      if (formData.role === "student") {
        const parentPassword = formData.parentPassword || "Parent#123"; // Default or provided
        const hashedParentPassword = await bcrypt.hash(parentPassword, 10);

        const parentUser = {
          id: newUserId + 1,
          username: formData.parentEmail,
          email: formData.parentEmail,
          password: hashedParentPassword,
          role: "parent",
          schoolName: formData.school,
          firstName: formData.firstName + "'s Parent",
          lastName: formData.lastName,
          phone: formData.parentPhone,
          aadhar: formData.parentAadhar,
          studentEmail: formData.email,
          approved: true, // Parents are auto-approved
          status: "approved",
          createdAt: new Date().toISOString(),
        };

        if (files.parentDocuments) {
          parentUser.documents = files.parentDocuments.map((f) => f.filename);
        }

        users.push(parentUser);
      }

      // Save updated users
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

      res.json({
        message:
          "Signup successful! Your account is pending approval. Please contact your principal.",
      });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /me - Get current user info
router.get("/me", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, "secretkey");
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const usersPath = path.join(__dirname, "..", "data", "users.json");
    let raw = fs.readFileSync(usersPath, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    const users = JSON.parse(raw);

    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't leak password
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error("Error getting user info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
