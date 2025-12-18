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

const ProfessorDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    pendingGrades: 0,
    researchProjects: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now
      setStats({
        totalStudents: 150,
        totalAssignments: 25,
        pendingGrades: 15,
        researchProjects: 8,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="professor" />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, ml: isMobile ? 0 : "280px" }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Professor Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h5">{stats.totalStudents}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Assignments
                  </Typography>
                  <Typography variant="h5">{stats.totalAssignments}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Grades
                  </Typography>
                  <Typography variant="h5">{stats.pendingGrades}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Research Projects
                  </Typography>
                  <Typography variant="h5">{stats.researchProjects}</Typography>
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
                element={<AssignmentsPage role="professor" />}
              />
              <Route path="grades" element={<GradesPage role="professor" />} />
              <Route
                path="messages"
                element={<MessagesPage role="professor" />}
              />
              <Route
                path="notifications"
                element={<NotificationsPage role="professor" />}
              />
              <Route
                path="profile"
                element={<ProfilePage role="professor" />}
              />
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
        Welcome to your Professor Dashboard
      </Typography>
      <Typography variant="body1">
        Here you can manage your courses, assignments, grades, research
        projects, and communicate with students and faculty.
      </Typography>
    </Box>
  );
};

export default ProfessorDashboard;
