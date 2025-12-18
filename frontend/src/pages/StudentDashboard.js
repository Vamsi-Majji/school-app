import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme, useMediaQuery, Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Grade as GradeIcon, Assignment as AssignmentIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import Chart from '../components/Chart';
import Sidebar from '../components/Sidebar';
import AssignmentsPage from './AssignmentsPage';
import GradesPage from './GradesPage';
import MessagesPage from './MessagesPage';
import NotificationsPage from './NotificationsPage';
import ProfilePage from './ProfilePage';

const StudentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector(state => state.auth.user);

  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // Mock data fetching - in real app, fetch from API
    fetchGrades();
    fetchAssignments();
    fetchAttendance();
  }, [user]);

  const fetchGrades = async () => {
    try {
      // Mock grades data filtered by user
      const mockGrades = [
        { subject: 'Math', grade: 85 },
        { subject: 'Science', grade: 90 },
        { subject: 'English', grade: 92 },
        { subject: 'History', grade: 78 },
        { subject: 'PE', grade: 80 },
      ];
      setGrades(mockGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      // Mock assignments data
      const mockAssignments = [
        { subject: 'Math', completed: 8, total: 10 },
        { subject: 'Science', completed: 7, total: 9 },
        { subject: 'English', completed: 9, total: 10 },
      ];
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      // Mock attendance data for previous 9 months (up to current date)
      const mockAttendance = [
        { month: 'May', percentage: 96 },
        { month: 'Jun', percentage: 94 },
        { month: 'Jul', percentage: 98 },
        { month: 'Aug', percentage: 92 },
        { month: 'Sep', percentage: 95 },
        { month: 'Oct', percentage: 97 },
        { month: 'Nov', percentage: 93 },
        { month: 'Dec', percentage: 95 },
        { month: 'Jan', percentage: 98 },
        { month: 'Feb', percentage: 96 },
      ];
      setAttendance(mockAttendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const gradeChartData = {
    labels: grades.map(g => g.subject),
    datasets: [{
      label: 'Grades',
      data: grades.map(g => g.grade),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  };

  const assignmentChartData = {
    labels: assignments.map(a => a.subject),
    datasets: [{
      label: 'Completed Assignments',
      data: assignments.map(a => (a.completed / a.total) * 100),
      backgroundColor: '#36A2EB',
    }]
  };

  const attendanceChartData = {
    labels: attendance.map(a => a.month),
    datasets: [{
      label: 'Attendance %',
      data: attendance.map(a => a.percentage),
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }]
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="student" />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto', marginLeft: isMobile ? 0 : '280px', width: isMobile ? '100%' : 'calc(100% - 280px)' }}>
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<DashboardContent grades={grades} assignments={assignments} attendance={attendance} gradeChartData={gradeChartData} assignmentChartData={assignmentChartData} attendanceChartData={attendanceChartData} />} />
            <Route path="dashboard" element={<DashboardContent grades={grades} assignments={assignments} attendance={attendance} gradeChartData={gradeChartData} assignmentChartData={assignmentChartData} attendanceChartData={attendanceChartData} />} />
            <Route path="assignments" element={<AssignmentsPage role="student" />} />
            <Route path="homework" element={<AssignmentsPage role="student" />} />
            <Route path="grades" element={<GradesPage role="student" />} />
            <Route path="messages" element={<MessagesPage role="student" />} />
            <Route path="notifications" element={<NotificationsPage role="student" />} />
            <Route path="profile" element={<ProfilePage role="student" />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

const DashboardContent = ({ grades, assignments, attendance, gradeChartData, assignmentChartData, attendanceChartData }) => {
  const [expandedView, setExpandedView] = useState(null); // 'grades', 'attendance', or null

  const averageGrade = grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length) : 0;
  const totalAssignments = assignments.reduce((sum, a) => sum + a.total, 0);
  const completedAssignments = assignments.reduce((sum, a) => sum + a.completed, 0);
  const averageAttendance = attendance.length > 0 ? Math.round(attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length) : 0;

  const handleChartClick = (chartType) => {
    setExpandedView(chartType);
  };

  const closeExpandedView = () => {
    setExpandedView(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GradeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Average Grade</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {averageGrade}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Assignments</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {completedAssignments}/{totalAssignments}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Attendance</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {averageAttendance}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Grades by Subject
              </Typography>
              <Box sx={{ height: 300, cursor: 'pointer' }} onClick={() => handleChartClick('grades')}>
                <Chart type="bar" data={gradeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignment Completion
              </Typography>
              <Box sx={{ height: 300 }}>
                <Chart type="pie" data={assignmentChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance Trend
              </Typography>
              <Box sx={{ height: 300, cursor: 'pointer' }} onClick={() => handleChartClick('attendance')}>
                <Chart type="line" data={attendanceChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {expandedView && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">
                    {expandedView === 'grades' ? 'Detailed Grades' : 'Detailed Attendance (Previous 6 Months)'}
                  </Typography>
                  <Typography variant="button" sx={{ cursor: 'pointer', color: 'primary.main' }} onClick={closeExpandedView}>
                    Close
                  </Typography>
                </Box>
                <Box sx={{ height: 400 }}>
                  {expandedView === 'grades' ? (
                    <Chart type="bar" data={gradeChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                  ) : (
                    <Chart type="line" data={attendanceChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  )}
                </Box>
                {expandedView === 'grades' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Grade Details:</Typography>
                    {grades.map((grade, index) => (
                      <Typography key={index} variant="body1">
                        {grade.subject}: {grade.grade}%
                      </Typography>
                    ))}
                  </Box>
                )}
                {expandedView === 'attendance' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Attendance Details:</Typography>
                    {attendance.map((att, index) => (
                      <Typography key={index} variant="body1">
                        {att.month}: {att.percentage}%
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
