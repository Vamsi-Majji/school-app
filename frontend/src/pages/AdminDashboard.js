import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import Chart from "../components/Chart";
import Sidebar from "../components/Sidebar";
import SettingsPage from "./SettingsPage";
import CustomizationsPage from "./CustomizationsPage";
import SetupPage from "./SetupPage";
import UsersPage from "./UsersPage";
import ClassesPage from "./ClassesPage";
import AuditLogPage from "./AuditLogPage";

const AdminDashboard = () => {
  const userRegistrationData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Registrations",
        data: [12, 19, 15, 25, 22, 30],
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const systemPerformanceData = {
    labels: ["CPU Usage", "Memory Usage", "Disk Usage", "Network Usage"],
    datasets: [
      {
        label: "System Performance (%)",
        data: [45, 60, 30, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const DashboardContent = () => (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">User Registration Trends</Typography>
              </Box>
              <Chart type="line" data={userRegistrationData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">System Performance</Typography>
              </Box>
              <Chart type="bar" data={systemPerformanceData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: isMobile ? 0 : "280px",
          mt: isMobile ? "56px" : 0,
        }}
      >
        <Routes>
          <Route path="" element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="audit" element={<AuditLogPage />} />
          <Route path="customizations" element={<CustomizationsPage />} />
          <Route path="setup" element={<SetupPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
