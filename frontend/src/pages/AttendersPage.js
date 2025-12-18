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
  Chip,
  Avatar,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const AttendersPage = ({ role }) => {
  const [attenders, setAttenders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setAttenders([
      { id: 1, name: 'Jane Wilson', department: 'Grade 10', email: 'jane@example.com', status: 'Active' },
      { id: 2, name: 'Tom Brown', department: 'Grade 9', email: 'tom@example.com', status: 'Active' },
    ]);
  }, []);

  const filteredAttenders = attenders.filter(attender =>
    attender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attender.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Attenders Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <TextField
                  placeholder="Search attenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                >
                  Add Attender
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAttenders.map((attender) => (
                      <TableRow key={attender.id}>
                        <TableCell>
                          <Avatar>{attender.name.charAt(0)}</Avatar>
                        </TableCell>
                        <TableCell>{attender.name}</TableCell>
                        <TableCell>{attender.department}</TableCell>
                        <TableCell>{attender.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={attender.status}
                            color={attender.status === 'Active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" startIcon={<EditIcon />} sx={{ mr: 1 }}>
                            Edit
                          </Button>
                          <Button size="small" color="error" startIcon={<DeleteIcon />}>
                            Delete
                          </Button>
                        </TableCell>
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

export default AttendersPage;
