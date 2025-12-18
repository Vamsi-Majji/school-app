import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Tooltip,
  Chip,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import Chart from '../components/Chart';
import NotificationBadge from '../components/NotificationBadge';
import Sidebar from '../components/Sidebar';
import MarkingPage from './MarkingPage';
import AlertsPage from './AlertsPage';
import ReportsPage from './ReportsPage';

const AttenderDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceStats, setAttendanceStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    fetch('/api/classes').then(res => res.json()).then(setClasses);
    fetch('/api/attendances').then(res => res.json()).then(attendanceData => {
      // Calculate stats from attendance data
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = attendanceData.filter(a => a.date === today);
      const totalStudents = todayAttendance.length;
      const presentToday = todayAttendance.filter(a => a.status === 'present').length;
      const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
      const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

      setAttendanceStats({
        totalStudents,
        presentToday,
        absentToday,
        attendanceRate
      });
    });
  }, []);

  const markAttendance = (classId, studentId, status) => {
    setAttendance(prev => ({ ...prev, [`${classId}-${studentId}`]: status }));
  };

  const attendanceData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [Object.values(attendance).filter(s => s === 'present').length, Object.values(attendance).filter(s => s === 'absent').length],
      backgroundColor: ['#36A2EB', '#FF6384'],
    }],
  };

  const weeklyAttendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Attendance Rate (%)',
      data: [85, 88, 82, 90, 87],
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }],
  };

  const classAttendanceData = {
    labels: classes.map(c => c.name),
    datasets: [{
      label: 'Average Attendance (%)',
      data: classes.map(() => Math.floor(Math.random() * 20) + 80), // Mock data
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const DashboardContent = () => (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Attender Dashboard
      </Typography>

      <Box sx={{ mb: 3 }}>
        <NotificationBadge count={2} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Mark Attendance</Typography>
              </Box>
              {classes.map(c => (
                <Box key={c.id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {c.name}
                  </Typography>
                  {/* Mock students */}
                  {[1, 2, 3].map(s => (
                    <Box key={s} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Student {s}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => markAttendance(c.id, s, 'present')}
                        sx={{ mr: 1 }}
                      >
                        Present
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => markAttendance(c.id, s, 'absent')}
                      >
                        Absent
                      </Button>
                    </Box>
                  ))}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Attendance Report</Typography>
              </Box>
              <Chart type="pie" data={attendanceData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="attender" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: isMobile ? 0 : '280px',
          mt: isMobile ? '56px' : 0,
        }}
      >
        <Routes>
          <Route path="" element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="marking" element={<MarkingPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AttenderDashboard;
