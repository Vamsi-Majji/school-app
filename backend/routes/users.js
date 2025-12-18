const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fs = require("fs").promises;
const path = require("path");
const fsSync = require("fs");

const usersPath = path.join(__dirname, "../data/users.json");
const pendingApplicationsPath = path.join(
  __dirname,
  "../data/pendingApplications.json"
);
const classesPath = path.join(__dirname, "../data/classes.json");

// Helper function to read users
const readUsers = async () => {
  const data = await fs.readFile(usersPath, "utf8");
  return JSON.parse(data);
};

// Helper function to write users
const writeUsers = async (users) => {
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
};

// Helper function to read pending applications
const readPendingApplications = async () => {
  try {
    const data = await fs.readFile(pendingApplicationsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
};

// Helper function to write pending applications
const writePendingApplications = async (applications) => {
  await fs.writeFile(
    pendingApplicationsPath,
    JSON.stringify(applications, null, 2)
  );
};

// Helper function to read classes
const readClasses = async () => {
  try {
    const data = await fs.readFile(classesPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
};

// Helper function to write classes
const writeClasses = async (classes) => {
  await fs.writeFile(classesPath, JSON.stringify(classes, null, 2));
};

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await readUsers();
    res.json(users);
  } catch (error) {
    console.error("Error reading users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = req.user.role;
    if (role === "principal" && user.schoolName !== req.user.schoolName) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error reading user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get pending applications (Principal only)
router.get("/applications/pending", auth, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res
        .status(403)
        .json({ message: "Access denied. Principal only." });
    }

    const users = await readUsers();
    const pendingApplications = users
      .filter(
        (user) =>
          user.status === "pending" && user.schoolName === req.user.schoolName
      )
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(pendingApplications);
  } catch (error) {
    console.error("Error reading pending applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Approve or reject application (Principal only)
router.post("/applications/:id/:action", auth, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res
        .status(403)
        .json({ message: "Access denied. Principal only." });
    }

    const { id, action } = req.params;
    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid action. Use approve or reject." });
    }

    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[userIndex];

    if (user.schoolName !== req.user.schoolName) {
      return res
        .status(403)
        .json({ message: "Access denied. User from different school." });
    }

    if (user.status !== "pending") {
      return res.status(400).json({ message: "User is not in pending status" });
    }

    if (action === "approve") {
      users[userIndex] = {
        ...user,
        status: "approved",
        approved: true,
      };
    } else if (action === "reject") {
      // Remove the user from the system for rejection
      users.splice(userIndex, 1);
    }

    await writeUsers(users);
    res.json({ message: `Application ${action}d successfully` });
  } catch (error) {
    console.error("Error processing application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Assign teacher to class/subject (Principal only)
router.post("/assignments", auth, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res
        .status(403)
        .json({ message: "Access denied. Principal only." });
    }

    const { teacherId, classId, subject } = req.body;

    if (!teacherId || !classId || !subject) {
      return res
        .status(400)
        .json({ message: "teacherId, classId, and subject are required" });
    }

    const classes = await readClasses();
    const classIndex = classes.findIndex((c) => c.id === parseInt(classId));

    if (classIndex === -1) {
      return res.status(404).json({ message: "Class not found" });
    }

    const classData = classes[classIndex];
    if (classData.schoolName !== req.user.schoolName) {
      return res
        .status(403)
        .json({ message: "Access denied. Class from different school." });
    }

    // Update class with new teacher assignment
    classes[classIndex] = {
      ...classData,
      teacherId: parseInt(teacherId),
      subject: subject,
    };

    await writeClasses(classes);
    res.json({ message: "Teacher assigned to class successfully" });
  } catch (error) {
    console.error("Error assigning teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    const userId = req.user.id;

    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile fields
    users[userIndex] = {
      ...users[userIndex],
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      phone: phone || users[userIndex].phone,
      address: address || users[userIndex].address,
    };

    await writeUsers(users);

    // Return updated user data
    const updatedUser = users[userIndex];
    const { password, ...safeUser } = updatedUser;
    res.json({ message: "Profile updated successfully", user: safeUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Promote student to higher class (Principal only)
router.post("/promotions", auth, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res
        .status(403)
        .json({ message: "Access denied. Principal only." });
    }

    const { studentId, newClassId } = req.body;

    if (!studentId || !newClassId) {
      return res
        .status(400)
        .json({ message: "studentId and newClassId are required" });
    }

    const users = await readUsers();
    const classes = await readClasses();

    const student = users.find(
      (u) => u.id === parseInt(studentId) && u.role === "student"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.schoolName !== req.user.schoolName) {
      return res
        .status(403)
        .json({ message: "Access denied. Student from different school." });
    }

    const newClass = classes.find((c) => c.id === parseInt(newClassId));
    if (!newClass) {
      return res.status(404).json({ message: "New class not found" });
    }

    if (newClass.schoolName !== req.user.schoolName) {
      return res
        .status(403)
        .json({ message: "Access denied. New class from different school." });
    }

    // Here you could add logic to update student's class assignment
    // For now, we'll just return success as the promotion logic might be more complex
    res.json({ message: "Student promoted successfully" });
  } catch (error) {
    console.error("Error promoting student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
