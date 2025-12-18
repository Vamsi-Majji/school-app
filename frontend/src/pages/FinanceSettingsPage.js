import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, TextField, Switch, FormControlLabel, Divider } from '@mui/material';

const FinanceSettingsPage = () => {
  const [settings, setSettings] = useState({
    lateFeeEnabled: false,
    lateFeeAmount: '',
    lateFeePercentage: '',
    discountEnabled: false,
    maxDiscountPercentage: '',
    autoInvoiceGeneration: false,
    paymentReminderDays: '',
    fiscalYearStart: '',
    currency: 'USD'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/finance-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching finance settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/finance-settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving finance settings:', error);
    }
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Finance Policy & Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Late Fee Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.lateFeeEnabled}
                    onChange={(e) => handleChange('lateFeeEnabled', e.target.checked)}
                  />
                }
                label="Enable Late Fees"
              />
              {settings.lateFeeEnabled && (
                <>
                  <TextField
                    label="Late Fee Amount ($)"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={settings.lateFeeAmount}
                    onChange={(e) => handleChange('lateFeeAmount', e.target.value)}
                  />
                  <TextField
                    label="Late Fee Percentage (%)"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={settings.lateFeePercentage}
                    onChange={(e) => handleChange('lateFeePercentage', e.target.value)}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Discount Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.discountEnabled}
                    onChange={(e) => handleChange('discountEnabled', e.target.checked)}
                  />
                }
                label="Enable Discounts"
              />
              {settings.discountEnabled && (
                <TextField
                  label="Max Discount Percentage (%)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={settings.maxDiscountPercentage}
                  onChange={(e) => handleChange('maxDiscountPercentage', e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invoice & Payment Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoInvoiceGeneration}
                    onChange={(e) => handleChange('autoInvoiceGeneration', e.target.checked)}
                  />
                }
                label="Auto Invoice Generation"
              />
              <TextField
                label="Payment Reminder Days"
                type="number"
                fullWidth
                margin="normal"
                value={settings.paymentReminderDays}
                onChange={(e) => handleChange('paymentReminderDays', e.target.value)}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <TextField
                label="Fiscal Year Start (MM-DD)"
                fullWidth
                margin="normal"
                value={settings.fiscalYearStart}
                onChange={(e) => handleChange('fiscalYearStart', e.target.value)}
              />
              <TextField
                label="Currency"
                fullWidth
                margin="normal"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Settings
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FinanceSettingsPage;
