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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  ReportProblem as ReportProblemIcon,
} from "@mui/icons-material";
import Chart from "../components/Chart";
import NotificationBadge from "../components/NotificationBadge";
import Messaging from "../components/Messaging";
import ComplaintSystem from "../components/ComplaintSystem";
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

const TeacherDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    pendingGrades: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now
      setStats({
        totalStudents: 25,
        totalAssignments: 12,
        pendingGrades: 8,
        attendanceRate: 85,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="teacher" />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, ml: isMobile ? 0 : "280px" }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Teacher Dashboard
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
                    <strong>Name:</strong> Teacher Name
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Role:</strong> Teacher
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> teacher@school.edu
                  </Typography>
                  <Typography variant="body1">
                    <strong>Subject:</strong> Mathematics
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
                    View Assignments
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Manage Grades
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Take Attendance
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  >
                    Send Messages
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
                element={<AssignmentsPage role="teacher" />}
              />
              <Route
                path="homework"
                element={<AssignmentsPage role="teacher" />}
              />
              <Route path="grades" element={<GradesPage role="teacher" />} />
              <Route path="attendance" element={<AttendanceManagementPage />} />
              <Route path="students" element={<TeachersPage />} />
              <Route
                path="messages"
                element={<MessagesPage role="teacher" />}
              />
              <Route
                path="notifications"
                element={<NotificationsPage role="teacher" />}
              />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage role="teacher" />} />
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
        Welcome to your Teacher Dashboard
      </Typography>
      <Typography variant="body1">
        Here you can manage your classes, assignments, grades, and communicate
        with students and parents.
      </Typography>
    </Box>
  );
};

export default TeacherDashboard;
