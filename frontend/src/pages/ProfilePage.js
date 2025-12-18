import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Description as DocumentIcon,
} from "@mui/icons-material";

const ProfilePage = ({ role }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    studentId: "",
    avatar: "",
  });
  const [userData, setUserData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: "en",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const user = await response.json();
        setUserData(user);
        setProfile({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone || "",
          address: "",
          studentId: user.id,
          avatar: "",
        });

        // Collect all documents
        const allDocs = [];
        if (user.documents)
          allDocs.push(
            ...user.documents.map((f) => ({
              filename: f,
              type: "School Documents",
            }))
          );
        if (user.educationDocuments)
          allDocs.push(
            ...user.educationDocuments.map((f) => ({
              filename: f,
              type: "Education Documents",
            }))
          );
        if (user.experienceDocuments)
          allDocs.push(
            ...user.experienceDocuments.map((f) => ({
              filename: f,
              type: "Experience Documents",
            }))
          );
        if (user.otherDocuments)
          allDocs.push(
            ...user.otherDocuments.map((f) => ({
              filename: f,
              type: "Other Documents",
            }))
          );
        if (user.parentDocuments)
          allDocs.push(
            ...user.parentDocuments.map((f) => ({
              filename: f,
              type: "Parent Documents",
            }))
          );
        setDocuments(allDocs);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to mock data
      setProfile({
        name: "John Doe",
        email: "john.doe@school.com",
        phone: "+1 (555) 123-4567",
        address: "123 School Street, City, State 12345",
        studentId: "STU001",
        avatar: "",
      });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      // Split the name into firstName and lastName
      const nameParts = profile.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: profile.phone,
          address: profile.address,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state with saved data
        setUserData(result.user);
        setProfile({
          name: `${result.user.firstName} ${result.user.lastName}`,
          email: result.user.email,
          phone: result.user.phone || "",
          address: result.user.address || "",
          studentId: result.user.id,
          avatar: profile.avatar, // Keep avatar as it's not saved to backend
        });
        setIsEditing(false);
        // Show success message (you could add a snackbar here)
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to save profile");
        // Show error message (you could add a snackbar here)
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      // Show error message (you could add a snackbar here)
    }
  };

  const handleCancel = () => {
    // Reset changes
    setIsEditing(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/download/${filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Failed to download document");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const profileFields = [
    { key: "name", label: "Full Name", icon: PersonIcon, editable: true },
    { key: "email", label: "Email", icon: EmailIcon, editable: true },
    { key: "phone", label: "Phone", icon: PhoneIcon, editable: true },
    { key: "address", label: "Address", icon: LocationIcon, editable: true },
    {
      key: "studentId",
      label: "Student ID",
      icon: SchoolIcon,
      editable: false,
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        My Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                >
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: -8,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": { backgroundColor: "primary.dark" },
                    }}
                    component="label"
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <PhotoCameraIcon />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h6" gutterBottom>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => setSettingsOpen(true)}
                  sx={{ mr: 1 }}
                >
                  Settings
                </Button>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {profileFields.map((field) => {
                  const IconComponent = field.icon;
                  return (
                    <Box
                      key={field.key}
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <IconComponent color="action" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {field.label}
                        </Typography>
                        {isEditing && field.editable ? (
                          <TextField
                            fullWidth
                            size="small"
                            value={profile[field.key]}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                [field.key]: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <Typography variant="body1">
                            {profile[field.key]}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Statistics
              </Typography>
              <Grid container spacing={2}>
                {role === "student" && (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.assignmentsCompleted || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Assignments Completed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.averageGrade || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Grade
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.attendanceRate || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Attendance Rate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.activeCourses || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Courses
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
                {role === "teacher" && (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.classesTaught || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Classes Taught
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.studentsCount || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Students
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.assignmentsGraded || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Assignments Graded
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.experienceYears || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Years Experience
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
                {role === "principal" && (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.totalStudents || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Students
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.totalTeachers || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Teachers
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.schoolRating || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          School Rating
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.yearsAsPrincipal || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Years as Principal
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
                {role === "accountant" && (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          ₹{userData?.totalRevenue || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Revenue
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.pendingInvoices || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Invoices
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          ₹{userData?.monthlyExpenses || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monthly Expenses
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.payrollProcessed || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Payroll Processed
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
                {!["student", "teacher", "principal", "accountant"].includes(
                  role
                ) && (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.tasksCompleted || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tasks Completed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.performanceRating || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Performance Rating
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.workingHours || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Working Hours
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {userData?.yearsOfService || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Years of Service
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {documents.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Documents
                </Typography>
                <List>
                  {documents.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <DocumentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.filename}
                        secondary={doc.type}
                      />
                      <IconButton
                        edge="end"
                        onClick={() => handleDownload(doc.filename)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Account Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smsNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="SMS Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) =>
                    setSettings({ ...settings, darkMode: e.target.checked })
                  }
                />
              }
              label="Dark Mode"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSettingsOpen(false)}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
