import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';

const MarkingPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setClasses([
      { id: 1, name: 'Class 1A', students: 25 },
      { id: 2, name: 'Class 2B', students: 28 },
      { id: 3, name: 'Class 3C', students: 22 },
    ]);
  }, []);

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    // Mock attendance data
    const mockAttendance = {};
    for (let i = 1; i <= 25; i++) {
      mockAttendance[`student-${i}`] = null; // null = not marked, true = present, false = absent
    }
    setAttendance(mockAttendance);
  };

  const markAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = () => {
    // Mock submission
    alert('Attendance submitted successfully!');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Attendance Marking
      </Typography>

      {!selectedClass ? (
        <Grid container spacing={3}>
          {classes.map((cls) => (
            <Grid item xs={12} md={4} key={cls.id}>
              <Card elevation={3} sx={{ cursor: 'pointer' }} onClick={() => handleClassSelect(cls.id)}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {cls.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {cls.students} students
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Marking attendance for {classes.find(c => c.id === selectedClass)?.name}
            </Typography>
            <Button variant="outlined" onClick={() => setSelectedClass(null)}>
              Back to Classes
            </Button>
          </Box>

          <Card elevation={3}>
            <CardContent>
              <List>
                {Object.keys(attendance).map((studentId) => (
                  <ListItem key={studentId} divider>
                    <ListItemText
                      primary={`Student ${studentId.split('-')[1]}`}
                      secondary={
                        <Chip
                          size="small"
                          label={
                            attendance[studentId] === null ? 'Not Marked' :
                            attendance[studentId] ? 'Present' : 'Absent'
                          }
                          color={
                            attendance[studentId] === null ? 'default' :
                            attendance[studentId] ? 'success' : 'error'
                          }
                        />
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        variant={attendance[studentId] === true ? 'contained' : 'outlined'}
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => markAttendance(studentId, true)}
                        sx={{ mr: 1 }}
                      >
                        Present
                      </Button>
                      <Button
                        size="small"
                        variant={attendance[studentId] === false ? 'contained' : 'outlined'}
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => markAttendance(studentId, false)}
                      >
                        Absent
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" color="primary" size="large" onClick={submitAttendance}>
              Submit Attendance
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default MarkingPage;
