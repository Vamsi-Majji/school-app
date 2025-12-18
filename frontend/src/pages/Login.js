import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import { login } from "../redux/actions/authActions";
import { useBranding } from "../contexts/BrandingContext";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error as ErrorIcon,
} from "@mui/icons-material";
import "./Login.css";

const Login = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    school: "",
    role: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, user, loading } = useSelector((state) => state.auth);
  const { updateCurrentSchool } = useBranding();

  useEffect(() => {
    if (!user) return;
    const target = `/${user.role}/dashboard`;
    // only navigate if not already at the target to avoid loops
    if (window.location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  // Update branding when user logs in
  useEffect(() => {
    if (user && user.schoolName) {
      updateCurrentSchool(user.schoolName);
    }
  }, [user, updateCurrentSchool]);

  const roles = [
    { value: "admin", label: "Admin", avatar: "👨‍💼" },
    { value: "teacher", label: "Teacher", avatar: "👨‍🏫" },
    { value: "student", label: "Student", avatar: "👨‍🎓" },
    { value: "parent", label: "Parent", avatar: "👨‍👩‍👧‍👦" },
    { value: "principal", label: "Principal", avatar: "👨‍💼" },
    { value: "attender", label: "Attender", avatar: "👨‍💻" },
    { value: "accountant", label: "Accountant", avatar: "💼" },
    { value: "maid", label: "Maid", avatar: "👩‍🍳" },
    { value: "professor", label: "Professor", avatar: "👨‍🏫" },
    { value: "dean", label: "Dean", avatar: "👨‍🎓" },
    { value: "hod", label: "HOD", avatar: "👨‍💼" },
    { value: "librarian", label: "Librarian", avatar: "📚" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1 && !formData.school.trim()) {
      alert("Please enter school/organization name");
      return;
    }
    if (step === 2 && !formData.role) {
      alert("Please select a role");
      return;
    }
    if (step === 3) {
      if (!formData.email.trim() || !formData.password.trim()) {
        alert("Please fill all fields");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      login({
        username: formData.email.trim(),
        password: formData.password.trim(),
      })
    );
  };

  const steps = [
    "Welcome",
    "School Selection",
    "Role Selection",
    "Credentials",
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Zoom in={true} timeout={800}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    Your gateway to efficient school management
                  </Typography>
                </Box>
              </Zoom>

              <Grow in={true} timeout={1200}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        setIsAnimating(true);
                        setTimeout(() => setStep(1), 300);
                      }}
                      sx={{
                        minWidth: 140,
                        py: 1.5,
                        px: 4,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      🚀 Sign In
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/signup")}
                      sx={{
                        minWidth: 140,
                        py: 1.5,
                        px: 4,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        borderColor: "rgba(102, 126, 234, 0.5)",
                        color: "#667eea",
                        "&:hover": {
                          borderColor: "#667eea",
                          backgroundColor: "rgba(102, 126, 234, 0.1)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      ✨ Sign Up
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {["👨‍🏫", "👨‍🎓", "👨‍💼", "📚", "💻", "🎯"].map(
                      (emoji, index) => (
                        <Grow
                          in={true}
                          timeout={1400 + index * 200}
                          key={index}
                        >
                          <Box
                            sx={{
                              fontSize: "2rem",
                              animation: `bounce 2s ease-in-out ${
                                index * 0.2
                              }s infinite`,
                              "@keyframes bounce": {
                                "0%, 20%, 50%, 80%, 100%": {
                                  transform: "translateY(0)",
                                },
                                "40%": { transform: "translateY(-10px)" },
                                "60%": { transform: "translateY(-5px)" },
                              },
                            }}
                          >
                            {emoji}
                          </Box>
                        </Grow>
                      )
                    )}
                  </Box>
                </Box>
              </Grow>
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={true} timeout={500}>
            <Box sx={{ py: 2 }}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ color: "#667eea", fontWeight: 600 }}
              >
                🏫 Select Your School/Organization
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose the institution you belong to
              </Typography>
              <Zoom in={true} timeout={600}>
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
                      <SchoolIcon sx={{ mr: 1, color: "#667eea" }} />
                    ),
                  }}
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                  }}
                />
              </Zoom>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={true} timeout={500}>
            <Box sx={{ py: 2 }}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ color: "#667eea", fontWeight: 600 }}
              >
                👥 Select Your Role
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose your position in the school ecosystem
              </Typography>
              <Zoom in={true} timeout={600}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      bgcolor: formData.role ? "#667eea" : "#f5f5f5",
                      fontSize: "2.5rem",
                      transition: "all 0.3s ease",
                      transform: formData.role ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {roles.find((r) => r.value === formData.role)?.avatar ||
                      "👤"}
                  </Avatar>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#667eea" }}>
                      Select Role
                    </InputLabel>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      label="Select Role"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                          },
                        },
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 1,
                            }}
                          >
                            <span
                              style={{ marginRight: 12, fontSize: "1.5rem" }}
                            >
                              {role.avatar}
                            </span>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {role.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Zoom>
            </Box>
          </Fade>
        );
      case 3:
        return (
          <Fade in={true} timeout={500}>
            <Box sx={{ py: 2 }}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ color: "#667eea", fontWeight: 600 }}
              >
                🔐 Enter Your Credentials
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Securely access your account
              </Typography>
              <Zoom in={true} timeout={600}>
                <Box>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <EmailIcon sx={{ mr: 1, color: "#667eea" }} />
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#667eea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <LockIcon sx={{ mr: 1, color: "#667eea" }} />
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "#667eea" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#667eea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                    }}
                  />
                </Box>
              </Zoom>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {renderStep()}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          {step > 0 && step < 3 && (
            <Button variant="outlined" onClick={prevStep}>
              Previous
            </Button>
          )}
          {step > 0 && step < 3 && (
            <Button variant="contained" onClick={nextStep}>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          )}
        </Box>

        {step === 0 && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button variant="text" onClick={() => navigate("/signup")}>
              Don't have an account? Sign Up
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
