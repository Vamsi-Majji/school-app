import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Chip } from '@mui/material';
import { CleaningServices as CleaningIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Assessment as AssessmentIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import ReportsPage from './ReportsPage';
import AlertsPage from './AlertsPage';

const MaidDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setTasks([
      { id: 1, title: 'Clean Classroom 1A', status: 'pending', priority: 'high', location: 'Floor 1' },
      { id: 2, title: 'Empty trash bins in hallway', status: 'completed', priority: 'medium', location: 'Floor 2' },
      { id: 3, title: 'Clean staff room', status: 'pending', priority: 'low', location: 'Floor 3' },
      { id: 4, title: 'Mop cafeteria floor', status: 'pending', priority: 'high', location: 'Ground Floor' },
    ]);
    setCompletedTasks(1);
    setPendingTasks(3);
  }, []);

  const markTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
    setCompletedTasks(prev => prev + 1);
    setPendingTasks(prev => prev - 1);
  };

  const DashboardContent = () => (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Maid Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CleaningIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Total Tasks
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {tasks.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Assigned Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Completed
                </Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {completedTasks}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tasks Done
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Pending
                </Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {pendingTasks}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tasks Remaining
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Today's Tasks
              </Typography>
              <List>
                {tasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            size="small"
                            label={task.location}
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={task.priority}
                            color={
                              task.priority === 'high' ? 'error' :
                              task.priority === 'medium' ? 'warning' : 'success'
                            }
                          />
                          <Chip
                            size="small"
                            label={task.status}
                            color={task.status === 'completed' ? 'success' : 'default'}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      {task.status === 'pending' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => markTaskComplete(task.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="maid" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, md: '280px' },
          mt: { xs: '56px', md: 0 },
        }}
      >
        <Routes>
          <Route path="" element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="tasks" element={<DashboardContent />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default MaidDashboard;
