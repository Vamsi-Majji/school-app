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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const AttendanceManagementPage = ({ role }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classes, setClasses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setClasses([
      { id: 1, name: 'Grade 10A', students: 25 },
      { id: 2, name: 'Grade 10B', students: 28 },
      { id: 3, name: 'Grade 9A', students: 22 },
    ]);

    setAttendanceRecords([
      { id: 1, studentName: 'Alice Johnson', class: 'Grade 10A', date: '2024-01-15', status: 'Present', time: '8:30 AM' },
      { id: 2, studentName: 'Bob Smith', class: 'Grade 10A', date: '2024-01-15', status: 'Absent', time: '-' },
      { id: 3, studentName: 'Charlie Brown', class: 'Grade 10B', date: '2024-01-15', status: 'Present', time: '8:45 AM' },
      { id: 4, studentName: 'Diana Wilson', class: 'Grade 9A', date: '2024-01-15', status: 'Late', time: '9:15 AM' },
    ]);
  }, []);

  const filteredRecords = attendanceRecords.filter(record =>
    (record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     record.class.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedClass === '' || record.class === selectedClass) &&
    (selectedDate === '' || record.date === selectedDate)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      default: return 'default';
    }
  };

  const handleMarkAttendance = (recordId, status) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.id === recordId
          ? { ...record, status, time: status === 'Present' ? new Date().toLocaleTimeString() : '-' }
          : record
      )
    );
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Attendance Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ minWidth: 250 }}
                  />

                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Class</InputLabel>
                    <Select
                      value={selectedClass}
                      label="Class"
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <MenuItem value="">All Classes</MenuItem>
                      {classes.map(cls => (
                        <MenuItem key={cls.id} value={cls.name}>{cls.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AssessmentIcon />}
                >
                  Generate Report
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                            {record.studentName}
                          </Box>
                        </TableCell>
                        <TableCell>{record.class}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.time}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.status}
                            color={getStatusColor(record.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleMarkAttendance(record.id, 'Present')}
                            sx={{ mr: 1 }}
                          >
                            Present
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleMarkAttendance(record.id, 'Absent')}
                            sx={{ mr: 1 }}
                          >
                            Absent
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleViewDetails(record)}
                          >
                            Details
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

        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Present Today</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {filteredRecords.filter(r => r.status === 'Present').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Absent Today</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                {filteredRecords.filter(r => r.status === 'Absent').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Late Arrivals</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {filteredRecords.filter(r => r.status === 'Late').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Attendance Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6">{selectedRecord.studentName}</Typography>
              <Typography>Class: {selectedRecord.class}</Typography>
              <Typography>Date: {selectedRecord.date}</Typography>
              <Typography>Status: {selectedRecord.status}</Typography>
              <Typography>Time: {selectedRecord.time}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AttendanceManagementPage;
