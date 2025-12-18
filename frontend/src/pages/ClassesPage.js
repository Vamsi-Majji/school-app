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
  Class as ClassIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Chart from '../components/Chart';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/classes').then(res => res.json()),
      fetch('/api/users').then(res => res.json())
    ])
      .then(([classesData, usersData]) => {
        setClasses(classesData);
        setUsers(usersData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  const getTeacherName = (teacherId) => {
    const teacher = users.find(u => u.id === teacherId);
    return teacher ? teacher.username : `Teacher ${teacherId}`;
  };

  const subjectColors = {
    Math: '#FF6384',
    Science: '#36A2EB',
    History: '#FFCE56',
    English: '#4BC0C0',
    Geography: '#9966FF',
    Art: '#FF9F40',
    PE: '#FF6384',
    Music: '#36A2EB',
    Chemistry: '#FFCE56',
    Physics: '#4BC0C0',
  };

  const subjectDistribution = {
    labels: Object.keys(subjectColors),
    datasets: [{
      label: 'Class Count',
      data: Object.keys(subjectColors).map(subject =>
        classes.filter(c => c.subject === subject).length
      ),
      backgroundColor: Object.values(subjectColors),
    }],
  };

  const classCountBySubject = {
    labels: Object.keys(subjectColors),
    datasets: [{
      label: 'Number of Classes',
      data: Object.keys(subjectColors).map(subject =>
        classes.filter(c => c.subject === subject).length
      ),
      backgroundColor: Object.values(subjectColors),
    }],
  };

  const classCreationTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Class Creations',
      data: [2, 1, 2, 1, 2, 1, 1, 0, 0, 0, 0, 0],
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
          Loading Classes...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Classes Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Fade in={true} style={{ transitionDelay: '200ms' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ClassIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Subject Distribution</Typography>
                </Box>
                <Chart type="pie" data={subjectDistribution} />
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
                  <Typography variant="h6">Class Count by Subject</Typography>
                </Box>
                <Chart type="bar" data={classCountBySubject} />
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
                  <Typography variant="h6">Class Creation Trends</Typography>
                </Box>
                <Chart type="line" data={classCreationTrends} />
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Zoom in={true} style={{ transitionDelay: '800ms' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Class List
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Class Name</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Teacher</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classes.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell>{classItem.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={classItem.subject}
                              sx={{ bgcolor: subjectColors[classItem.subject] || '#ccc', color: 'white' }}
                            />
                          </TableCell>
                          <TableCell>{getTeacherName(classItem.teacherId)}</TableCell>
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

export default ClassesPage;
