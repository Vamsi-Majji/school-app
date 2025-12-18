import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import axios from "axios";

const UserApprovalPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [userRole, setUserRole] = useState("");
  const [selectedPrincipal, setSelectedPrincipal] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/users/applications/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingUsers(response.data);
    } catch (error) {
      console.error("Error fetching pending items:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch pending applications",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/users/applications/${userId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: "User approved successfully",
        severity: "success",
      });
      fetchPendingItems(); // Refresh the list
    } catch (error) {
      console.error("Error approving:", error);
      setSnackbar({
        open: true,
        message: "Failed to approve user",
        severity: "error",
      });
    }
  };

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/users/applications/${userId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: "User rejected successfully",
        severity: "warning",
      });
      fetchPendingItems(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting:", error);
      setSnackbar({
        open: true,
        message: "Failed to reject user",
        severity: "error",
      });
    }
  };

  const handleViewDetails = (principal) => {
    setSelectedPrincipal(principal);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPrincipal(null);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "error",
      principal: "primary",
      teacher: "secondary",
      student: "info",
      parent: "warning",
      librarian: "success",
      accountant: "default",
      hod: "primary",
      dean: "secondary",
      professor: "info",
      attender: "warning",
      maid: "default",
    };
    return colors[role] || "default";
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Approval Management
        </Typography>
        <Typography>Loading pending users...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User Approval Management
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pending User Approvals
        </Typography>

        {pendingUsers.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No pending users to approve at this time.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Role</strong>
                  </TableCell>
                  <TableCell>
                    <strong>School</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Applied Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        }
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.schoolName}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(user.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => handleReject(user.id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserApprovalPage;
