import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useTheme,
  useMediaQuery,
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import Chart from "../components/Chart";
import Sidebar from "../components/Sidebar";
import AssignmentsPage from "./AssignmentsPage";
import GradesPage from "./GradesPage";
import MessagesPage from "./MessagesPage";
import NotificationsPage from "./NotificationsPage";
import ProfilePage from "./ProfilePage";
import AttendanceManagementPage from "./AttendanceManagementPage";
import TeachersPage from "./TeachersPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";

const HodDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    departmentBudget: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now
      setStats({
        totalFaculty: 25,
        totalStudents: 500,
        departmentBudget: 2500000,
        pendingApprovals: 12,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="hod" />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, ml: isMobile ? 0 : "280px" }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Head of Department Dashboard
          </Typography>
          <Grid container spacing={3}>
            {/* Profile Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Name:</strong> HOD Name
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Role:</strong> Head of Department
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> hod@school.edu
                  </Typography>
                  <Typography variant="body1">
                    <strong>Department:</strong> Computer Science
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    Access key functions from the sidebar menu
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  >
                    View Faculty
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Manage Students
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Review Budget
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Approve Requests
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="dashboard" element={<DashboardContent />} />
              <Route
                path="assignments"
                element={<AssignmentsPage role="hod" />}
              />
              <Route path="homework" element={<AssignmentsPage role="hod" />} />
              <Route path="grades" element={<GradesPage role="hod" />} />
              <Route path="attendance" element={<AttendanceManagementPage />} />
              <Route path="students" element={<TeachersPage />} />
              <Route path="messages" element={<MessagesPage role="hod" />} />
              <Route
                path="notifications"
                element={<NotificationsPage role="hod" />}
              />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage role="hod" />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const DashboardContent = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Welcome to your Head of Department Dashboard
      </Typography>
      <Typography variant="body1">
        Here you can manage department faculty, students, budget, and oversee
        academic activities.
      </Typography>
    </Box>
  );
};

export default HodDashboard;
