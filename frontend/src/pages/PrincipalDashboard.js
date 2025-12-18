import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import UserApprovalPage from "./UserApprovalPage";
import ReportsPage from "./ReportsPage";
import UsersPage from "./UsersPage";
import ClassesPage from "./ClassesPage";
import StudentsPage from "./StudentsPage";
import TeachersPage from "./TeachersPage";
import ParentsPage from "./ParentsPage";
import AttendersPage from "./AttendersPage";
import MeetingsPage from "./MeetingsPage";
import PermissionsPage from "./PermissionsPage";
import AnalyticsPage from "./AnalyticsPage";
import ComplaintSystem from "../components/ComplaintSystem";
import BrandingPage from "./BrandingPage";
import NotificationsPage from "./NotificationsPage";
import ProfilePage from "./ProfilePage";

const PrincipalDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const DashboardContent = () => (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Principal Dashboard
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ProfilePage />
      </Box>
      <UserApprovalPage />
    </Container>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="principal" />
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
          <Route path="user-approval" element={<UserApprovalPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="parents" element={<ParentsPage />} />
          <Route path="attenders" element={<AttendersPage />} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="complaints" element={<ComplaintSystem />} />
          <Route path="branding" element={<BrandingPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default PrincipalDashboard;
