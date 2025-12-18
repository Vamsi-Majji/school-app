import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const AlertsPage = ({ role }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setAlerts([
      { id: 1, type: 'warning', message: 'Low attendance in Class 5A', timestamp: '2024-01-15 10:30', resolved: false },
      { id: 2, type: 'error', message: 'System maintenance scheduled for tonight', timestamp: '2024-01-15 09:00', resolved: false },
      { id: 3, type: 'info', message: 'New student enrollment completed', timestamp: '2024-01-14 16:45', resolved: true },
      { id: 4, type: 'warning', message: 'Cleaning supplies running low', timestamp: '2024-01-14 14:20', resolved: false },
    ]);
  }, []);

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      case 'info': return <InfoIcon color="info" />;
      default: return <InfoIcon />;
    }
  };

  const getAlertSeverity = (type) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Alerts & Notifications
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Recent Alerts
                </Typography>
                <Chip
                  label={`${alerts.filter(a => !a.resolved).length} Unresolved`}
                  color="warning"
                  size="small"
                />
              </Box>

              <List>
                {alerts.map((alert) => (
                  <ListItem key={alert.id} divider>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      {getAlertIcon(alert.type)}
                    </Box>
                    <ListItemText
                      primary={alert.message}
                      secondary={alert.timestamp}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={alert.resolved ? 'Resolved' : 'Pending'}
                          color={alert.resolved ? 'success' : 'warning'}
                          size="small"
                        />
                        {!alert.resolved && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alert Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Total Alerts:</Typography>
                  <Typography variant="h6">{alerts.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Resolved:</Typography>
                  <Typography variant="h6" color="success.main">
                    {alerts.filter(a => a.resolved).length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Pending:</Typography>
                  <Typography variant="h6" color="warning.main">
                    {alerts.filter(a => !a.resolved).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" fullWidth>
                  Mark All as Read
                </Button>
                <Button variant="outlined" fullWidth>
                  Export Alerts
                </Button>
                <Button variant="outlined" fullWidth>
                  Configure Alert Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AlertsPage;
