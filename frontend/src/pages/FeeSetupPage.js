import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const FeeSetupPage = () => {
  const [fees, setFees] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: '',
    frequency: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await axios.get('/api/fees');
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
    }
  };

  const handleOpen = (fee = null) => {
    if (fee) {
      setEditingFee(fee);
      setFormData(fee);
    } else {
      setEditingFee(null);
      setFormData({
        name: '',
        amount: '',
        type: '',
        frequency: '',
        dueDate: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFee(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingFee) {
        await axios.put(`/api/fees/${editingFee.id}`, formData);
      } else {
        await axios.post('/api/fees', formData);
      }
      fetchFees();
      handleClose();
    } catch (error) {
      console.error('Error saving fee:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/fees/${id}`);
      fetchFees();
    } catch (error) {
      console.error('Error deleting fee:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fee Setup & Structures
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fee Heads & Structures
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add New Fee
              </Button>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fees.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell>{fee.name}</TableCell>
                        <TableCell>{fee.amount}</TableCell>
                        <TableCell>{fee.type}</TableCell>
                        <TableCell>{fee.frequency}</TableCell>
                        <TableCell>{fee.dueDate}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleOpen(fee)}>Edit</Button>
                          <Button onClick={() => handleDelete(fee.id)} color="error">Delete</Button>
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
        <DialogTitle>{editingFee ? 'Edit Fee' : 'Add New Fee'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Fee Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            label="Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Frequency"
            fullWidth
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Due Date"
            fullWidth
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFee ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeeSetupPage;
