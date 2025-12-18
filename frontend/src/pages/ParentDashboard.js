import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import {
  ChildCare as ChildCareIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
  ReportProblem as ReportProblemIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import Chart from '../components/Chart';
import NotificationBadge from '../components/NotificationBadge';
import Messaging from '../components/Messaging';
import Calendar from '../components/Calendar';
import HomeworkTracker from '../components/HomeworkTracker';
import ComplaintSystem from '../components/ComplaintSystem';
import Sidebar from '../components/Sidebar';
import AssignmentsPage from './AssignmentsPage';
import GradesPage from './GradesPage';
import MessagesPage from './MessagesPage';
import NotificationsPage from './NotificationsPage';
import FeedbackPage from './FeedbackPage';

const DashboardContent = ({ children, meetings, allGrades, allAttendance, notifications, urgentBanners, selectedChild, setSelectedChild, feedback, setFeedback, submitFeedback }) => {
  // Filter data based on selected child or show all if none selected
  const childGrades = selectedChild ? allGrades.filter(g => g.studentId === selectedChild) : allGrades;
  const childAttendance = selectedChild ? allAttendance.filter(a => a.studentId === selectedChild) : allAttendance;

  // Calculate attendance percentage
  const totalDays = childAttendance.length;
  const presentDays = childAttendance.filter(a => a.status === 'present').length;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Parent Dashboard
      </Typography>

      <Box sx={{ position: 'relative', mb: 3 }}>
        <NotificationBadge count={notifications.length} />
      </Box>

      {urgentBanners.map((banner, i) => (
        <Alert key={i} severity="warning" sx={{ mb: 2 }}>
          {banner}
        </Alert>
      ))}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChildCareIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Children
                </Typography>
              </Box>
              {children.map(c => (
                <Button
                  key={c.id}
                  onClick={() => setSelectedChild(c.id)}
                  variant={selectedChild === c.id ? 'contained' : 'text'}
                  startIcon={<ChildCareIcon />}
                  sx={{ display: 'block', textTransform: 'none', mb: 1 }}
                >
                  {c.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {selectedChild && (
          <>
            <Grid item xs={12} md={6} lg={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                      Grades by Subject
                    </Typography>
                  </Box>
                  {childGrades.length > 0 ? (
                    <Chart type="bar" data={{
                      labels: childGrades.map(g => g.subject),
                      datasets: [{
                        label: 'Grades',
                        data: childGrades.map(g => g.grade),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                      }]
                    }} />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No grade data available for selected child.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                      Attendance Overview
                    </Typography>
                  </Box>
                  {childAttendance.length > 0 ? (
                    <Chart type="pie" data={{
                      labels: ['Present', 'Absent'],
                      datasets: [{
                        data: [presentDays, totalDays - presentDays],
                        backgroundColor: ['#36A2EB', '#FF6384'],
                      }]
                    }} />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No attendance data available for selected child.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                      Grade Trend
                    </Typography>
                  </Box>
                  {childGrades.length > 0 ? (
                    <Chart type="line" data={{
                      labels: childGrades.map(g => g.subject),
                      datasets: [{
                        label: 'Grades Over Time',
                        data: childGrades.map(g => g.grade),
                        borderColor: '#4BC0C0',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                      }]
                    }} />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No grade trend data available.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Calendar
                </Typography>
              </Box>
              <Calendar />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MessageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Meetings
                </Typography>
              </Box>
              {meetings.map(m => (
                <Typography key={m.id} variant="body2" sx={{ mb: 1 }}>
                  {m.title} - {m.date}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReportProblemIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Feedback Channel
                </Typography>
              </Box>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={submitFeedback}
                fullWidth
              >
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <HomeworkTracker role="parent" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Messaging />
        </Grid>

        <Grid item xs={12}>
          <ComplaintSystem role="parent" />
        </Grid>
      </Grid>
    </Container>
  );
};

const ParentDashboard = (props) => {
  const [children, setChildren] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [urgentBanners] = useState(['Urgent: Parent-Teacher Meeting Tomorrow']);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    // Mock data - in real app, fetch based on parent ID
    setChildren([
      { id: 2, name: 'John Doe', class: 'Grade 10' },
      { id: 8, name: 'Jane Doe', class: 'Grade 8' }
    ]);

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    fetch('/api/meetings', { headers })
      .then(res => res.ok ? res.json() : [])
      .then(setMeetings)
      .catch(() => setMeetings([]));
    fetch('/api/grades', { headers })
      .then(res => res.ok ? res.json() : [])
      .then(setAllGrades)
      .catch(() => setAllGrades([]));
    fetch('/api/attendances', { headers })
      .then(res => res.ok ? res.json() : [])
      .then(setAllAttendance)
      .catch(() => setAllAttendance([]));
    fetch('/api/notifications', { headers })
      .then(res => res.ok ? res.json() : [])
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  const submitFeedback = () => {
    // Mock feedback submission
    alert('Feedback submitted: ' + feedback);
    setFeedback('');
  };

  const drawerWidth = 240; // match Sidebar width

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Fixed Sidebar column */}
      <Box
        component="nav"
        sx={{
          width: { xs: 0, sm: `${drawerWidth}px` },
          flexShrink: 0,
          position: { xs: 'relative', sm: 'fixed' },
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: 1200,
        }}
      >
        <Sidebar role="parent" drawerWidth={drawerWidth} />
      </Box>

      {/* Main content area — offset by Sidebar width on larger screens */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          ml: { xs: 0, sm: `${drawerWidth}px` },
          p: 3,
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardContent children={children} meetings={meetings} allGrades={allGrades} allAttendance={allAttendance} notifications={notifications} urgentBanners={urgentBanners} selectedChild={selectedChild} setSelectedChild={setSelectedChild} feedback={feedback} setFeedback={setFeedback} submitFeedback={submitFeedback} />} />
          <Route path="/dashboard" element={<DashboardContent children={children} meetings={meetings} allGrades={allGrades} allAttendance={allAttendance} notifications={notifications} urgentBanners={urgentBanners} selectedChild={selectedChild} setSelectedChild={setSelectedChild} feedback={feedback} setFeedback={setFeedback} submitFeedback={submitFeedback} />} />
          <Route path="/assignments" element={<AssignmentsPage role="parent" />} />
          <Route path="/grades" element={<GradesPage role="parent" />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<MessagesPage role="parent" />} />
          <Route path="/notifications" element={<NotificationsPage role="parent" />} />
          <Route path="/feedback" element={<FeedbackPage role="parent" />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ParentDashboard;
