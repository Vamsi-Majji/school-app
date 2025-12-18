import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  MenuItem,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import axios from 'axios';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    version: '1.0.0',
    multiSchoolMode: false,
    maxSchools: 10,
    features: {
      notifications: true,
      realTimeUpdates: true,
      auditLog: true,
    },
    customSettings: {
      theme: 'default',
      language: 'en',
    },
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/application');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setMessage('Error loading settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put('/api/application', settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFeatureChange = (feature, value) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [feature]: value,
      },
    });
  };

  const handleCustomSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      customSettings: {
        ...settings.customSettings,
        [setting]: value,
      },
    });
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Loading Settings...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          System Settings
        </Typography>

        {message && (
          <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  School Management
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.multiSchoolMode}
                      onChange={(e) => setSettings({ ...settings, multiSchoolMode: e.target.checked })}
                    />
                  }
                  label="Multi-School Mode"
                />
                {settings.multiSchoolMode && (
                  <TextField
                    fullWidth
                    label="Maximum Schools"
                    type="number"
                    value={settings.maxSchools}
                    onChange={(e) => setSettings({ ...settings, maxSchools: parseInt(e.target.value) })}
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.notifications}
                      onChange={(e) => handleFeatureChange('notifications', e.target.checked)}
                    />
                  }
                  label="Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.realTimeUpdates}
                      onChange={(e) => handleFeatureChange('realTimeUpdates', e.target.checked)}
                    />
                  }
                  label="Real-Time Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.features.auditLog}
                      onChange={(e) => handleFeatureChange('auditLog', e.target.checked)}
                    />
                  }
                  label="Audit Log"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customization
                </Typography>
                <TextField
                  select
                  fullWidth
                  label="Theme"
                  value={settings.customSettings.theme}
                  onChange={(e) => handleCustomSettingChange('theme', e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Language"
                  value={settings.customSettings.language}
                  onChange={(e) => handleCustomSettingChange('language', e.target.value)}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </TextField>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSave} size="large">
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SettingsPage;
