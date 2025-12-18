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
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material';
import {
  People as PeopleIcon,
  Email as EmailIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import Chart from '../components/Chart';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  const roleColors = {
    admin: '#FF6384',
    student: '#36A2EB',
    teacher: '#FFCE56',
    parent: '#4BC0C0',
    principal: '#9966FF',
    attender: '#FF9F40',
  };

  const roleDistribution = {
    labels: ['Admins', 'Students', 'Teachers', 'Parents', 'Principals', 'Attenders'],
    datasets: [{
      label: 'User Count',
      data: [
        users.filter(u => u.role === 'admin').length,
        users.filter(u => u.role === 'student').length,
        users.filter(u => u.role === 'teacher').length,
        users.filter(u => u.role === 'parent').length,
        users.filter(u => u.role === 'principal').length,
        users.filter(u => u.role === 'attender').length,
      ],
      backgroundColor: Object.values(roleColors),
    }],
  };

  const userCountByRole = {
    labels: ['Admins', 'Students', 'Teachers', 'Parents', 'Principals', 'Attenders'],
    datasets: [{
      label: 'Number of Users',
      data: [
        users.filter(u => u.role === 'admin').length,
        users.filter(u => u.role === 'student').length,
        users.filter(u => u.role === 'teacher').length,
        users.filter(u => u.role === 'parent').length,
        users.filter(u => u.role === 'principal').length,
        users.filter(u => u.role === 'attender').length,
      ],
      backgroundColor: Object.values(roleColors),
    }],
  };

  const userRegistrationTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'User Registrations',
      data: [5, 8, 12, 15, 10, 18, 22, 25, 20, 28, 30, 35],
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }],
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" gutterBottom>
          Loading Users...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Users Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Fade in={true} style={{ transitionDelay: '200ms' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Role Distribution</Typography>
                </Box>
                <Chart type="pie" data={roleDistribution} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={6}>
          <Fade in={true} style={{ transitionDelay: '400ms' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">User Count by Role</Typography>
                </Box>
                <Chart type="bar" data={userCountByRole} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Fade in={true} style={{ transitionDelay: '600ms' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">User Registration Trends</Typography>
                </Box>
                <Chart type="line" data={userRegistrationTrends} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Zoom in={true} style={{ transitionDelay: '800ms' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User List
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Avatar</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>School</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Avatar sx={{ bgcolor: roleColors[user.role] || '#ccc' }}>
                              {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              sx={{ bgcolor: roleColors[user.role] || '#ccc', color: 'white' }}
                            />
                          </TableCell>
                          <TableCell>{user.schoolName}</TableCell>
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

export default UsersPage;
