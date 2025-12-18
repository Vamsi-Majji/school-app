import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/actions/authActions";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fade,
  Zoom,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import "./SignUp.css";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    school: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    schoolDescription: "",
    documents: [],
    // Parent details for students
    parentEmail: "",
    parentPhone: "",
    parentPassword: "",
    parentAadhar: "",
    parentDocuments: [],
    // Additional document fields for other roles
    experienceDocuments: [],
    educationDocuments: [],
    otherDocuments: [],
    // Teacher specific fields
    subjectGroup: "",
    subjectsToTeach: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roles = [
    { value: "admin", label: "Admin", avatar: "👨‍💼" },
    { value: "teacher", label: "Teacher", avatar: "👨‍🏫" },
    { value: "student", label: "Student", avatar: "👨‍🎓" },
    { value: "principal", label: "Principal", avatar: "👨‍💼" },
    { value: "attender", label: "Attender", avatar: "👨‍💻" },
    { value: "maid", label: "Maid", avatar: "🧹" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.school.trim()) {
      setError("Please enter school/organization name");
      return;
    }
    if (step === 2 && !formData.role) {
      setError("Please select a role");
      return;
    }
    if (step === 3) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("Please fill all fields");
        return;
      }
    }
    if (step === 4) {
      if (
        !formData.email.trim() ||
        !formData.password.trim() ||
        !formData.confirmPassword.trim()
      ) {
        setError("Please fill all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    if (step === 5) {
      if (formData.role === "student") {
        if (
          !formData.parentEmail.trim() ||
          !formData.parentPhone.trim() ||
          !formData.parentPassword.trim() ||
          !formData.parentAadhar.trim() ||
          formData.parentDocuments.length === 0
        ) {
          setError("Please fill all parent information fields");
          return;
        }
      } else if (formData.role === "principal") {
        if (
          !formData.schoolDescription.trim() ||
          formData.documents.length === 0
        ) {
          setError("Please fill all fields for principal registration");
          return;
        }
      } else if (formData.role === "teacher") {
        if (!formData.subjectGroup || formData.subjectsToTeach.length === 0) {
          setError("Please select subject group and subjects to teach");
          return;
        }
      } else if (["attender", "maid"].includes(formData.role)) {
        if (
          formData.experienceDocuments.length === 0 ||
          formData.educationDocuments.length === 0 ||
          formData.otherDocuments.length === 0
        ) {
          setError("Please fill all document fields");
          return;
        }
      }
    }
    if (step === 6) {
      if (formData.role === "student") {
        if (
          formData.educationDocuments.length === 0 ||
          formData.otherDocuments.length === 0
        ) {
          setError("Please fill all student document fields");
          return;
        }
      } else if (formData.role === "teacher") {
        if (
          formData.experienceDocuments.length === 0 ||
          formData.educationDocuments.length === 0 ||
          formData.otherDocuments.length === 0
        ) {
          setError("Please fill all document fields");
          return;
        }
      }
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          // Handle file arrays
          formData[key].forEach((file) => {
            formDataToSend.append(key, file);
          });
        } else {
          // Handle text fields
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        // Signup successful, but user needs approval before login
        setError(
          "Signup successful! Your account is pending approval. Please contact your principal."
        );
        // Reset form
        setFormData({
          school: "",
          role: "",
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          schoolDescription: "",
          documents: [],
          parentEmail: "",
          parentPhone: "",
          parentPassword: "",
          parentAadhar: "",
          parentDocuments: [],
          experienceDocuments: [],
          educationDocuments: [],
          otherDocuments: [],
          subjectGroup: "",
          subjectsToTeach: [],
        });
        setStep(1);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Sign up failed");
    }
    setLoading(false);
  };

  const getTotalSteps = () => {
    if (formData.role === "principal") return 6;
    if (formData.role === "student") return 6; // Student + Parent details + Documents
    if (formData.role === "teacher") return 7; // Personal + Account + Teacher Details + Documents
    if (["attender", "maid"].includes(formData.role)) return 6; // Personal + Account + Documents
    return 4; // Admin and other roles
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Welcome to School Management System
            </Typography>
            <TextField
              fullWidth
              label="School/Organization Name"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="Enter your school name"
              required
              InputProps={{
                startAdornment: (
                  <SchoolIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{ mt: 2 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Select Your Role
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                {roles.find((r) => r.value === formData.role)?.avatar || "👤"}
              </Avatar>
              <FormControl fullWidth>
                <InputLabel>Select Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Select Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 8 }}>{role.avatar}</span>
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
          </Box>
        );
      case 4:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Create Account
            </Typography>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
          </Box>
        );
      case 5:
        if (formData.role === "student") {
          return (
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Parent Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please provide your parent's contact information for account
                creation and verification.
              </Typography>
              <TextField
                fullWidth
                label="Parent Email"
                name="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Parent Phone Number"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Parent Password"
                name="parentPassword"
                type="password"
                value={formData.parentPassword}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Parent Aadhar Number"
                name="parentAadhar"
                value={formData.parentAadhar}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Parent Documents (ID proof, etc.)
                </Typography>
                <input
                  type="file"
                  name="parentDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
                <Typography variant="body2" color="text.secondary">
                  Documents will be verified during approval process
                </Typography>
              </Box>
            </Box>
          );
        } else if (formData.role === "principal") {
          return (
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Principal Registration Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                As a principal, please provide details about your school and
                submit required documents for verification.
              </Typography>
              <TextField
                fullWidth
                label="School Description"
                name="schoolDescription"
                value={formData.schoolDescription}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Describe your school, its mission, facilities, and any other relevant information..."
                required
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload School Documents (certificates, licenses, etc.)
                </Typography>
                <input
                  type="file"
                  name="documents"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
                <Typography variant="body2" color="text.secondary">
                  Documents will be verified by admin before account approval
                </Typography>
              </Box>
            </Box>
          );
        } else if (formData.role === "teacher") {
          return (
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Teaching Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please provide information about your teaching expertise and
                subjects.
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Subject Group</InputLabel>
                <Select
                  name="subjectGroup"
                  value={formData.subjectGroup}
                  onChange={handleChange}
                  label="Subject Group"
                  required
                >
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="Arts">Arts</MenuItem>
                  <MenuItem value="Commerce">Commerce</MenuItem>
                  <MenuItem value="Languages">Languages</MenuItem>
                  <MenuItem value="Mathematics">Mathematics</MenuItem>
                  <MenuItem value="Physical Education">
                    Physical Education
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Subjects You Want to Teach</InputLabel>
                <Select
                  name="subjectsToTeach"
                  multiple
                  value={formData.subjectsToTeach}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subjectsToTeach: e.target.value,
                    })
                  }
                  label="Subjects You Want to Teach"
                  required
                >
                  <MenuItem value="Math">Math</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="History">History</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Geography">Geography</MenuItem>
                  <MenuItem value="Art">Art</MenuItem>
                  <MenuItem value="PE">PE</MenuItem>
                  <MenuItem value="Music">Music</MenuItem>
                  <MenuItem value="Chemistry">Chemistry</MenuItem>
                  <MenuItem value="Physics">Physics</MenuItem>
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                  <MenuItem value="Biology">Biology</MenuItem>
                  <MenuItem value="Economics">Economics</MenuItem>
                  <MenuItem value="Psychology">Psychology</MenuItem>
                  <MenuItem value="Data Structures">Data Structures</MenuItem>
                  <MenuItem value="Software Engineering">
                    Software Engineering
                  </MenuItem>
                  <MenuItem value="Database Management">
                    Database Management
                  </MenuItem>
                  <MenuItem value="Web Development">Web Development</MenuItem>
                  <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                </Select>
              </FormControl>
            </Box>
          );
        } else if (["attender", "maid"].includes(formData.role)) {
          return (
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Document Verification
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please upload your verification documents for approval.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Experience Documents (certificates, references, etc.)
                </Typography>
                <input
                  type="file"
                  name="experienceDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Education Documents (degree certificates, diplomas,
                  etc.)
                </Typography>
                <input
                  type="file"
                  name="educationDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Other Documents (ID proof, background check, etc.)
                </Typography>
                <input
                  type="file"
                  name="otherDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
                <Typography variant="body2" color="text.secondary">
                  All documents will be verified before account approval
                </Typography>
              </Box>
            </Box>
          );
        }
        return null;
      case 6:
        if (formData.role === "student") {
          return (
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Student Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please upload your academic and identification documents.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Education Documents (certificates, transcripts, etc.)
                </Typography>
                <input
                  type="file"
                  name="educationDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload ID Documents (birth certificate, ID proof, etc.)
                </Typography>
                <input
                  type="file"
                  name="otherDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
                <Typography variant="body2" color="text.secondary">
                  Documents will be verified during approval process
                </Typography>
              </Box>
            </Box>
          );
        } else if (formData.role === "teacher") {
          return (
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Document Verification
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please upload your verification documents for approval.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Experience Documents (certificates, references, etc.)
                </Typography>
                <input
                  type="file"
                  name="experienceDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Education Documents (degree certificates, diplomas,
                  etc.)
                </Typography>
                <input
                  type="file"
                  name="educationDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Other Documents (ID proof, background check, etc.)
                </Typography>
                <input
                  type="file"
                  name="otherDocuments"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                />
                <Typography variant="body2" color="text.secondary">
                  All documents will be verified before account approval
                </Typography>
              </Box>
            </Box>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(step / getTotalSteps()) * 100}%` }}
          ></div>
        </div>
        {renderStep()}
        {error && <div className="error-message">{error}</div>}
        <div className="button-group">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Previous
            </button>
          )}
          {step < getTotalSteps() ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          )}
        </div>
        <div className="login-link">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="link-btn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
