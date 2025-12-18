import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Build as BuildIcon } from '@mui/icons-material';

const steps = ['Basic Info', 'Users Setup', 'Classes Setup', 'Complete'];

const SetupPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [setupData, setSetupData] = useState({
    schoolName: '',
    address: '',
    adminEmail: '',
    initialUsers: [],
    initialClasses: [],
  });
  const [message, setMessage] = useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = () => {
    // Mock save functionality
    setMessage('School setup completed successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic School Information
              </Typography>
              <TextField
                fullWidth
                label="School Name"
                value={setupData.schoolName}
                onChange={(e) => setSetupData({ ...setupData, schoolName: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={setupData.address}
                onChange={(e) => setSetupData({ ...setupData, address: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                value={setupData.adminEmail}
                onChange={(e) => setSetupData({ ...setupData, adminEmail: e.target.value })}
              />
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Initial Users Setup
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Users will be added in the next steps. This is a placeholder for user setup.
              </Typography>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Classes and Subjects Setup
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Classes will be configured in the next steps. This is a placeholder for class setup.
              </Typography>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Setup Complete
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your school management system is now ready to use!
              </Typography>
              <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                Finish Setup
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <BuildIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          School Setup
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep < steps.length - 1 && (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default SetupPage;
