import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const PermissionsPage = ({ role }) => {
  const [permissions, setPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setPermissions([
      {
        id: 1,
        role: 'Teacher',
        permissions: {
          viewStudents: true,
          editGrades: true,
          manageAssignments: true,
          viewReports: false,
          manageUsers: false,
        }
      },
      {
        id: 2,
        role: 'Parent',
        permissions: {
          viewStudents: true,
          editGrades: false,
          manageAssignments: false,
          viewReports: true,
          manageUsers: false,
        }
      },
      {
        id: 3,
        role: 'Student',
        permissions: {
          viewStudents: false,
          editGrades: false,
          manageAssignments: false,
          viewReports: true,
          manageUsers: false,
        }
      },
    ]);
  }, []);

  const filteredPermissions = permissions.filter(perm =>
    perm.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionChange = (roleId, permission, value) => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === roleId
          ? { ...p, permissions: { ...p.permissions, [permission]: value } }
          : p
      )
    );
  };

  const handleSavePermissions = () => {
    console.log('Saving permissions:', permissions);
    // In real app, make API call to save permissions
  };

  const permissionLabels = {
    viewStudents: 'View Students',
    editGrades: 'Edit Grades',
    manageAssignments: 'Manage Assignments',
    viewReports: 'View Reports',
    manageUsers: 'Manage Users',
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Permissions Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 1 }} />
                  Role Permissions
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 250 }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSavePermissions}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Role</TableCell>
                      {Object.keys(permissionLabels).map(key => (
                        <TableCell key={key} align="center">
                          {permissionLabels[key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPermissions.map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell>
                          <Chip
                            label={perm.role}
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        {Object.keys(permissionLabels).map(key => (
                          <TableCell key={key} align="center">
                            <Switch
                              checked={perm.permissions[key]}
                              onChange={(e) => handlePermissionChange(perm.id, key, e.target.checked)}
                              color="primary"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PermissionsPage;
