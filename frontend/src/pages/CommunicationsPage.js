import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';

const CommunicationsPage = () => {
  const [communications, setCommunications] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'email',
    recipientType: 'parents',
    subject: '',
    message: '',
    template: 'fee_reminder'
  });

  useEffect(() => {
    fetchCommunications();
  }, []);

  const fetchCommunications = async () => {
    try {
      const response = await axios.get('/api/communications');
      setCommunications(response.data);
    } catch (error) {
      console.error('Error fetching communications:', error);
    }
  };

  const handleOpen = () => {
    setFormData({
      type: 'email',
      recipientType: 'parents',
      subject: '',
      message: '',
      template: 'fee_reminder'
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/communications/send', formData);
      fetchCommunications();
      handleClose();
      alert('Communication sent successfully!');
    } catch (error) {
      console.error('Error sending communication:', error);
    }
  };

  const templates = {
    fee_reminder: {
      subject: 'Fee Payment Reminder',
      message: 'Dear Parent,\n\nThis is a reminder that the fee payment of $AMOUNT is due on DUE_DATE. Please make the payment at the earliest to avoid late fees.\n\nRegards,\nSchool Administration'
    },
    fee_receipt: {
      subject: 'Fee Payment Receipt',
      message: 'Dear Parent,\n\nYour payment of $AMOUNT has been received successfully. Receipt number: RECEIPT_NO\n\nThank you,\nSchool Administration'
    },
    fee_structure_change: {
      subject: 'Update on Fee Structure',
      message: 'Dear Parent,\n\nWe would like to inform you about changes in the fee structure. Please check the updated fee details in your student portal.\n\nRegards,\nSchool Administration'
    },
    salary_credited: {
      subject: 'Salary Credited',
      message: 'Dear Staff,\n\nYour salary for the month has been credited to your account. Please check your payslip in the portal.\n\nRegards,\nSchool Administration'
    }
  };

  const handleTemplateChange = (template) => {
    setFormData({
      ...formData,
      template,
      subject: templates[template].subject,
      message: templates[template].message
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Communications & Notifications
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Send Communication
              </Typography>
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Send New Communication
              </Button>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Recipient</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Sent Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {communications.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell>{comm.type}</TableCell>
                        <TableCell>{comm.recipientType}</TableCell>
                        <TableCell>{comm.subject}</TableCell>
                        <TableCell>
                          <Chip
                            label={comm.status}
                            color={comm.status === 'sent' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>{comm.sentDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Send New Communication</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Communication Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Recipient Type</InputLabel>
            <Select
              value={formData.recipientType}
              onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
            >
              <MenuItem value="parents">Parents</MenuItem>
              <MenuItem value="students">Students</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Template</InputLabel>
            <Select
              value={formData.template}
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <MenuItem value="fee_reminder">Fee Reminder</MenuItem>
              <MenuItem value="fee_receipt">Fee Receipt</MenuItem>
              <MenuItem value="fee_structure_change">Fee Structure Change</MenuItem>
              <MenuItem value="salary_credited">Salary Credited</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Subject"
            fullWidth
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Send Communication
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CommunicationsPage;
