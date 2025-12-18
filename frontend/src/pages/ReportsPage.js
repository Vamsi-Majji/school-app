import React from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Button } from '@mui/material';
import { Assessment as AssessmentIcon, Download as DownloadIcon } from '@mui/icons-material';

const ReportsPage = () => {
  const reports = [
    { title: 'Student Attendance Report', description: 'Monthly attendance summary for all students', type: 'attendance' },
    { title: 'Grade Distribution Report', description: 'Analysis of grades across subjects', type: 'grades' },
    { title: 'Assignment Completion Report', description: 'Overview of assignment submissions', type: 'assignments' },
    { title: 'Financial Summary Report', description: 'Monthly financial overview', type: 'finance' },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Reports
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    {report.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {report.description}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  fullWidth
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReportsPage;
