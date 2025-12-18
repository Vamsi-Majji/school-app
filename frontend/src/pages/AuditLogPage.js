import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material';
import {
  History as HistoryIcon,
  Person as PersonIcon,
  Build as ActionIcon,
} from '@mui/icons-material';
import Chart from '../components/Chart';

const AuditLogPage = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock audit logs since no audit.json exists
    const mockLogs = [
      { id: 1, user: 'admin', action: 'login', timestamp: '2023-10-01 10:00:00', details: 'Successful login' },
      { id: 2, user: 'student', action: 'view_grades', timestamp: '2023-10-01 11:00:00', details: 'Viewed grades' },
      { id: 3, user: 'teacher', action: 'update_assignment', timestamp: '2023-10-01 12:00:00', details: 'Updated assignment' },
      { id: 4, user: 'parent', action: 'view_reports', timestamp: '2023-10-01 13:00:00', details: 'Viewed reports' },
      { id: 5, user: 'principal', action: 'approve_leave', timestamp: '2023-10-01 14:00:00', details: 'Approved leave' },
      { id: 6, user: 'attender', action: 'mark_attendance', timestamp: '2023-10-01 15:00:00', details: 'Marked attendance' },
      { id: 7, user: 'admin', action: 'create_user', timestamp: '2023-10-02 09:00:00', details: 'Created new user' },
      { id: 8, user: 'student', action: 'submit_assignment', timestamp: '2023-10-02 10:00:00', details: 'Submitted assignment' },
      { id: 9, user: 'teacher', action: 'grade_assignment', timestamp: '2023-10-02 11:00:00', details: 'Graded assignment' },
      { id: 10, user: 'parent', action: 'send_message', timestamp: '2023-10-02 12:00:00', details: 'Sent message to teacher' },
    ];
    setAuditLogs(mockLogs);
    setLoading(false);
  }, []);

  const actionColors = {
    login: '#4BC0C0',
    view_grades: '#36A2EB',
    update_assignment: '#FFCE56',
    view_reports: '#FF6384',
    approve_leave: '#9966FF',
    mark_attendance: '#FF9F40',
    create_user: '#C9CBCF',
    submit_assignment: '#4BC0C0',
    grade_assignment: '#36A2EB',
    send_message: '#FF6384',
  };

  const actionDistribution = {
    labels: Object.keys(actionColors),
    datasets: [{
      label: 'Action Count',
      data: Object.keys(actionColors).map(action =>
        auditLogs.filter(log => log.action === action).length
      ),
      backgroundColor: Object.values(actionColors),
    }],
  };

  const actionsOverTime = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Actions per Day',
      data: [12, 19, 15, 25, 22, 8, 5],
      backgroundColor: '#36A2EB',
    }],
  };

  const auditTrends = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Audit Events',
      data: [45, 52, 38, 61],
      borderColor: '#FF6384',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: true,
    }],
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" gutterBottom>
          Loading Audit Logs...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Audit Log
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Fade in={true} style={{ transitionDelay: '200ms' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ActionIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Action Distribution</Typography>
                </Box>
                <Chart type="pie" data={actionDistribution} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={6}>
          <Fade in={true} style={{ transitionDelay: '400ms' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HistoryIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Actions Over Time</Typography>
                </Box>
                <Chart type="bar" data={actionsOverTime} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Fade in={true} style={{ transitionDelay: '600ms' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Audit Trends</Typography>
                </Box>
                <Chart type="line" data={auditTrends} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Zoom in={true} style={{ transitionDelay: '800ms' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Audit Log Entries
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Chip
                              label={log.action.replace('_', ' ')}
                              sx={{ bgcolor: actionColors[log.action] || '#ccc', color: 'white' }}
                            />
                          </TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell>{log.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuditLogPage;
