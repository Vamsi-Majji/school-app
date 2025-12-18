import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { login } from '../redux/actions/authActions';
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
  InputAdornment
} from '@mui/material';
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import './Login.css';

const Login = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    school: '',
    role: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, user, loading } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user) return;
    const target = `/${user.role}/dashboard`;
    // only navigate if not already at the target to avoid loops
    if (window.location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  const roles = [
    { value: 'admin', label: 'Admin', avatar: '👨‍💼' },
    { value: 'teacher', label: 'Teacher', avatar: '👨‍🏫' },
    { value: 'student', label: 'Student', avatar: '👨‍🎓' },
    { value: 'parent', label: 'Parent', avatar: '👨‍👩‍👧‍👦' },
    { value: 'principal', label: 'Principal', avatar: '👨‍💼' },
    { value: 'attender', label: 'Attender', avatar: '👨‍💻' },
    { value: 'accountant', label: 'Accountant', avatar: '💼' },
    { value: 'maid', label: 'Maid', avatar: '👩‍🍳' },
    { value: 'professor', label: 'Professor', avatar: '👨‍🏫' },
    { value: 'dean', label: 'Dean', avatar: '👨‍🎓' },
    { value: 'hod', label: 'HOD', avatar: '👨‍💼' },
    { value: 'librarian', label: 'Librarian', avatar: '📚' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1 && !formData.school.trim()) {
      alert('Please enter school/organization name');
      return;
    }
    if (step === 2 && !formData.role) {
      alert('Please select a role');
      return;
    }
    if (step === 3) {
      if (!formData.email.trim() || !formData.password.trim()) {
        alert('Please fill all fields');
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
    dispatch(login({ username: formData.email.trim(), password: formData.password.trim() }));
  };

  const steps = ['Welcome', 'School Selection', 'Role Selection', 'Credentials'];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Welcome to School Management System
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setStep(1)}
                sx={{ minWidth: 120 }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ minWidth: 120 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Select Your School/Organization
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
                startAdornment: <SchoolIcon sx={{ mr: 1, color: 'action.active' }} />,
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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                {roles.find(r => r.value === formData.role)?.avatar || '👤'}
              </Avatar>
              <FormControl fullWidth>
                <InputLabel>Select Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Select Role"
                >
                  {roles.map(role => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              Enter Your Credentials
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
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          )}
        </Box>

        {step === 0 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="text" onClick={() => navigate('/signup')}>
              Don't have an account? Sign Up
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
