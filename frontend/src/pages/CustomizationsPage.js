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
  ColorPicker,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';

const CustomizationsPage = () => {
  const [customizations, setCustomizations] = useState({
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    fontSize: 14,
    darkMode: false,
    logoUrl: '',
    schoolName: '',
  });
  const [message, setMessage] = useState('');

  const handleSave = () => {
    // Mock save functionality
    setMessage('Customizations saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <PaletteIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          App Customizations
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Theme Colors
                </Typography>
                <TextField
                  fullWidth
                  label="Primary Color"
                  type="color"
                  value={customizations.primaryColor}
                  onChange={(e) => setCustomizations({ ...customizations, primaryColor: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Secondary Color"
                  type="color"
                  value={customizations.secondaryColor}
                  onChange={(e) => setCustomizations({ ...customizations, secondaryColor: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={customizations.darkMode}
                      onChange={(e) => setCustomizations({ ...customizations, darkMode: e.target.checked })}
                    />
                  }
                  label="Dark Mode"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Typography
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Font Size: {customizations.fontSize}px
                </Typography>
                <Slider
                  value={customizations.fontSize}
                  onChange={(e, newValue) => setCustomizations({ ...customizations, fontSize: newValue })}
                  min={12}
                  max={20}
                  step={1}
                  valueLabelDisplay="auto"
                  sx={{ mb: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Branding
                </Typography>
                <TextField
                  fullWidth
                  label="School Name"
                  value={customizations.schoolName}
                  onChange={(e) => setCustomizations({ ...customizations, schoolName: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Logo URL"
                  value={customizations.logoUrl}
                  onChange={(e) => setCustomizations({ ...customizations, logoUrl: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSave} size="large">
              Save Customizations
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CustomizationsPage;
