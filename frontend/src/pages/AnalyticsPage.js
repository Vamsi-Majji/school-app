import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import Chart from "../components/Chart";

const AnalyticsPage = ({ role }) => {
  const [timeRange, setTimeRange] = useState("month");
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setAnalyticsData({
      studentEnrollment: 1250,
      teacherCount: 85,
      averageGrade: 85.6,
      attendanceRate: 92.3,
      gradeDistribution: {
        labels: ["A", "B", "C", "D", "F"],
        datasets: [
          {
            label: "Grade Distribution",
            data: [320, 280, 180, 90, 45],
            backgroundColor: [
              "#4CAF50",
              "#2196F3",
              "#FF9800",
              "#F44336",
              "#9C27B0",
            ],
          },
        ],
      },
      attendanceTrend: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Attendance Rate (%)",
            data: [88, 92, 89, 94, 91, 93],
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243, 0.1)",
            fill: true,
          },
        ],
      },
    });
  }, [timeRange]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3} sx={{ height: "150px" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Student Enrollment</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analyticsData.studentEnrollment}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3} sx={{ height: "150px" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Teachers</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analyticsData.teacherCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3} sx={{ height: "150px" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Average Grade</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analyticsData.averageGrade}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3} sx={{ height: "150px" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Attendance Rate</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analyticsData.attendanceRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "400px" }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Grade Distribution
              </Typography>
              {analyticsData.gradeDistribution && (
                <Chart type="pie" data={analyticsData.gradeDistribution} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "400px" }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Attendance Trend
              </Typography>
              {analyticsData.attendanceTrend && (
                <Chart type="line" data={analyticsData.attendanceTrend} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;
