import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const DuesRefundsPage = () => {
  const [dues, setDues] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRefund, setEditingRefund] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    amount: '',
    reason: '',
    status: 'pending'
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDues();
    fetchRefunds();
  }, []);

  const fetchDues = async () => {
    try {
      const response = await axios.get('/api/dues');
      setDues(response.data);
    } catch (error) {
      console.error('Error fetching dues:', error);
    }
  };

  const fetchRefunds = async () => {
    try {
      const response = await axios.get('/api/refunds');
      setRefunds(response.data);
    } catch (error) {
      console.error('Error fetching refunds:', error);
    }
  };

  const handleOpen = (refund = null) => {
    if (refund) {
      setEditingRefund(refund);
      setFormData(refund);
    } else {
      setEditingRefund(null);
      setFormData({
        studentId: '',
        studentName: '',
        amount: '',
        reason: '',
        status: 'pending'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRefund(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingRefund) {
        await axios.put(`/api/refunds/${editingRefund.id}`, formData);
      } else {
        await axios.post('/api/refunds', formData);
      }
      fetchRefunds();
      handleClose();
    } catch (error) {
      console.error('Error saving refund:', error);
    }
  };

  const sendReminder = async (dueId) => {
    try {
      await axios.post(`/api/dues/${dueId}/reminder`);
      alert('Reminder sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const filteredDues = dues.filter(due => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return new Date(due.dueDate) < new Date();
    if (filter === 'thisMonth') return new Date(due.dueDate).getMonth() === new Date().getMonth();
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dues & Refunds Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Outstanding Dues
              </Typography>
              <FormControl sx={{ mb: 2, minWidth: 120 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">All Dues</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="thisMonth">Due This Month</MenuItem>
                </Select>
              </FormControl>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Amount Due</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDues.map((due) => (
                      <TableRow key={due.id}>
                        <TableCell>{due.studentName}</TableCell>
                        <TableCell>${due.amount}</TableCell>
                        <TableCell>{due.dueDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={due.status}
                            color={due.status === 'overdue' ? 'error' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => sendReminder(due.id)}>
                            Send Reminder
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

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Refunds & Adjustments
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Process New Refund
              </Button>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {refunds.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell>{refund.studentName}</TableCell>
                        <TableCell>${refund.amount}</TableCell>
                        <TableCell>{refund.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={refund.status}
                            color={refund.status === 'approved' ? 'success' : refund.status === 'rejected' ? 'error' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => handleOpen(refund)}>Edit</Button>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingRefund ? 'Edit Refund' : 'Process New Refund'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Student ID"
            fullWidth
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Student Name"
            fullWidth
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Amount"
            fullWidth
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Reason"
            fullWidth
            multiline
            rows={3}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="processed">Processed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRefund ? 'Update' : 'Process'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DuesRefundsPage;
