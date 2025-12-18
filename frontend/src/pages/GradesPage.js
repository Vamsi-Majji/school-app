import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const GradesPage = ({ role }) => {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    // Mock data - replace with API call
    setGrades([
      { id: 1, subject: 'Mathematics', grade: 85, type: 'exam', date: '2024-01-10', teacher: 'Mr. Johnson', comments: 'Good work on algebra' },
      { id: 2, subject: 'Science', grade: 92, type: 'quiz', date: '2024-01-08', teacher: 'Ms. Smith', comments: 'Excellent understanding' },
      { id: 3, subject: 'English', grade: 78, type: 'assignment', date: '2024-01-05', teacher: 'Mrs. Davis', comments: 'Needs improvement in grammar' },
      { id: 4, subject: 'History', grade: 88, type: 'project', date: '2024-01-03', teacher: 'Mr. Wilson', comments: 'Well-researched' },
      { id: 5, subject: 'Art', grade: 95, type: 'practical', date: '2024-01-01', teacher: 'Ms. Brown', comments: 'Creative and original' },
    ]);

    setSubjects(['all', 'Mathematics', 'Science', 'English', 'History', 'Art']);
  }, []);

  const filteredGrades = selectedSubject === 'all' ? grades : grades.filter(g => g.subject === selectedSubject);

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'primary';
    if (grade >= 70) return 'warning';
    return 'error';
  };

  const getGradeLetter = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  const calculateGPA = () => {
    const total = grades.reduce((sum, g) => sum + g.grade, 0);
    return (total / grades.length).toFixed(2);
  };

  const getSubjectAverage = (subject) => {
    const subjectGrades = grades.filter(g => g.subject === subject);
    const total = subjectGrades.reduce((sum, g) => sum + g.grade, 0);
    return subjectGrades.length > 0 ? (total / subjectGrades.length).toFixed(1) : 0;
  };

  const getTrend = (current, previous) => {
    if (!previous) return 'stable';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        {role === 'student' ? 'My Grades' : 'Grade Management'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Overall Performance</Typography>
              </Box>
              <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                {calculateGPA()}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                GPA: {getGradeLetter(parseFloat(calculateGPA()))}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={parseFloat(calculateGPA())}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subject Averages
              </Typography>
              <Grid container spacing={2}>
                {subjects.filter(s => s !== 'all').map(subject => (
                  <Grid item xs={6} sm={4} key={subject}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {subject}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {getSubjectAverage(subject)}%
                      </Typography>
                      <Chip
                        label={getGradeLetter(parseFloat(getSubjectAverage(subject)))}
                        color={getGradeColor(parseFloat(getSubjectAverage(subject)))}
                        size="small"
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Detailed Grades</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {subjects.map(subject => (
                    <Chip
                      key={subject}
                      label={subject === 'all' ? 'All Subjects' : subject}
                      onClick={() => setSelectedSubject(subject)}
                      color={selectedSubject === subject ? 'primary' : 'default'}
                      variant={selectedSubject === subject ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Letter</TableCell>
                      <TableCell>Teacher</TableCell>
                      <TableCell>Comments</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGrades.map((grade) => (
                      <TableRow key={grade.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                              {grade.subject[0]}
                            </Avatar>
                            {grade.subject}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={grade.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{grade.date}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold">
                            {grade.grade}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getGradeLetter(grade.grade)}
                            color={getGradeColor(grade.grade)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{grade.teacher}</TableCell>
                        <TableCell>{grade.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Performance Trends
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {grades.slice(0, 5).map((grade, index) => {
                  const trend = getTrend(grade.grade, grades[index + 1]?.grade);
                  return (
                    <Box key={grade.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {grade.subject}
                        </Typography>
                        <Chip label={`${grade.grade}%`} size="small" color={getGradeColor(grade.grade)} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {trend === 'up' && <TrendingUpIcon color="success" />}
                        {trend === 'down' && <TrendingDownIcon color="error" />}
                        {trend === 'stable' && <GradeIcon color="action" />}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Grade Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['A', 'B', 'C', 'D', 'F'].map(letter => {
                  const count = grades.filter(g => getGradeLetter(g.grade) === letter).length;
                  const percentage = grades.length > 0 ? ((count / grades.length) * 100).toFixed(1) : 0;
                  return (
                    <Box key={letter} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ minWidth: 20 }}>
                        {letter}:
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={parseFloat(percentage)}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 40 }}>
                        {percentage}%
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GradesPage;
