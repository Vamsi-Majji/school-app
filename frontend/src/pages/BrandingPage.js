import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const BrandingPage = ({ role }) => {
  const [brandingSettings, setBrandingSettings] = useState({
    schoolName: 'Springfield High School',
    logo: null,
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    fontFamily: 'Roboto',
    showLogo: true,
    showSchoolName: true,
    customCSS: '',
  });

  const handleInputChange = (field, value) => {
    setBrandingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving branding settings:', brandingSettings);
    // In real app, make API call to save settings
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandingSettings(prev => ({
          ...prev,
          logo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Branding Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PaletteIcon sx={{ mr: 1 }} />
                School Information
              </Typography>

              <TextField
                fullWidth
                label="School Name"
                value={brandingSettings.schoolName}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  School Logo
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={brandingSettings.logo}
                    sx={{ width: 80, height: 80 }}
                  >
                    {brandingSettings.schoolName.charAt(0)}
                  </Avatar>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="logo-upload"
                    type="file"
                    onChange={handleLogoUpload}
                  />
                  <label htmlFor="logo-upload">
                    <IconButton color="primary" component="span">
                      <PhotoCameraIcon />
                    </IconButton>
                  </label>
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={brandingSettings.showLogo}
                    onChange={(e) => handleInputChange('showLogo', e.target.checked)}
                  />
                }
                label="Show Logo"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={brandingSettings.showSchoolName}
                    onChange={(e) => handleInputChange('showSchoolName', e.target.checked)}
                  />
                }
                label="Show School Name"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Color Scheme
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Primary Color"
                    type="color"
                    value={brandingSettings.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Secondary Color"
                    type="color"
                    value={brandingSettings.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Typography
              </Typography>

              <TextField
                fullWidth
                label="Font Family"
                value={brandingSettings.fontFamily}
                onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                placeholder="e.g., Roboto, Arial, sans-serif"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom CSS
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Custom CSS"
                value={brandingSettings.customCSS}
                onChange={(e) => handleInputChange('customCSS', e.target.value)}
                placeholder="Enter custom CSS rules..."
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              size="large"
            >
              Save Branding Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BrandingPage;
