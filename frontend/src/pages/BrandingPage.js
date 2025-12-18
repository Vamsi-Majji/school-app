import React, { useState } from "react";
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
  Alert,
  Snackbar,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  RestoreSharp as ResetIcon,
} from "@mui/icons-material";
import { useBranding } from "../contexts/BrandingContext";

const BrandingPage = ({ role }) => {
  const { branding, updateBranding, resetBranding } = useBranding();
  const [localSettings, setLocalSettings] = useState({
    ...branding,
    darkMode: branding.darkMode || false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (field, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateBranding(localSettings);
    setSnackbar({
      open: true,
      message: "Branding settings saved successfully!",
      severity: "success",
    });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalSettings((prev) => ({
          ...prev,
          logo: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    resetBranding();
    setLocalSettings(branding);
    setSnackbar({
      open: true,
      message: "Branding settings reset to default!",
      severity: "info",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PaletteIcon sx={{ mr: 1 }} />
                School Information
              </Typography>

              <TextField
                fullWidth
                label="School Name"
                value={localSettings.schoolName}
                onChange={(e) =>
                  handleInputChange("schoolName", e.target.value)
                }
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  School Logo
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={localSettings.logo}
                    sx={{ width: 80, height: 80 }}
                  >
                    {localSettings.schoolName.charAt(0)}
                  </Avatar>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
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
                    checked={localSettings.showLogo}
                    onChange={(e) =>
                      handleInputChange("showLogo", e.target.checked)
                    }
                  />
                }
                label="Show Logo"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.showSchoolName}
                    onChange={(e) =>
                      handleInputChange("showSchoolName", e.target.checked)
                    }
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
                    value={localSettings.primaryColor}
                    onChange={(e) =>
                      handleInputChange("primaryColor", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Secondary Color"
                    type="color"
                    value={localSettings.secondaryColor}
                    onChange={(e) =>
                      handleInputChange("secondaryColor", e.target.value)
                    }
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
                value={localSettings.fontFamily}
                onChange={(e) =>
                  handleInputChange("fontFamily", e.target.value)
                }
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
                value={localSettings.customCSS}
                onChange={(e) => handleInputChange("customCSS", e.target.value)}
                placeholder="Enter custom CSS rules..."
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={handleReset}
              size="large"
            >
              Reset to Default
            </Button>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BrandingPage;
