import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: '',
    payDate: ''
  });

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await axios.get('/api/payroll');
      setPayrolls(response.data);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
    }
  };

  const handleOpen = (payroll = null) => {
    if (payroll) {
      setEditingPayroll(payroll);
      setFormData(payroll);
    } else {
      setEditingPayroll(null);
      setFormData({
        employeeId: '',
        employeeName: '',
        basicSalary: '',
        allowances: '',
        deductions: '',
        netSalary: '',
        payDate: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPayroll(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingPayroll) {
        await axios.put(`/api/payroll/${editingPayroll.id}`, formData);
      } else {
        await axios.post('/api/payroll', formData);
      }
      fetchPayrolls();
      handleClose();
    } catch (error) {
      console.error('Error saving payroll:', error);
    }
  };

  const generatePayslip = async (payrollId) => {
    try {
      const response = await axios.get(`/api/payroll/${payrollId}/payslip`);
      // Handle PDF generation or download
      console.log('Payslip generated:', response.data);
    } catch (error) {
      console.error('Error generating payslip:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payroll & Payslips
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Salary Management
              </Typography>
              <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add New Payroll Entry
              </Button>
              <Button variant="outlined" sx={{ ml: 2 }}>
                Generate Bulk Payslips
              </Button>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Basic Salary</TableCell>
                      <TableCell>Allowances</TableCell>
                      <TableCell>Deductions</TableCell>
                      <TableCell>Net Salary</TableCell>
                      <TableCell>Pay Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrolls.map((payroll) => (
                      <TableRow key={payroll.id}>
                        <TableCell>{payroll.employeeName}</TableCell>
                        <TableCell>${payroll.basicSalary}</TableCell>
                        <TableCell>${payroll.allowances}</TableCell>
                        <TableCell>${payroll.deductions}</TableCell>
                        <TableCell>${payroll.netSalary}</TableCell>
                        <TableCell>{payroll.payDate}</TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => handleOpen(payroll)}>Edit</Button>
                          <Button size="small" onClick={() => generatePayslip(payroll.id)}>Generate Payslip</Button>
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
        <DialogTitle>{editingPayroll ? 'Edit Payroll' : 'Add New Payroll Entry'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Employee ID"
            fullWidth
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Employee Name"
            fullWidth
            value={formData.employeeName}
            onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Basic Salary"
            fullWidth
            type="number"
            value={formData.basicSalary}
            onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Allowances"
            fullWidth
            type="number"
            value={formData.allowances}
            onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Deductions"
            fullWidth
            type="number"
            value={formData.deductions}
            onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Net Salary"
            fullWidth
            type="number"
            value={formData.netSalary}
            onChange={(e) => setFormData({ ...formData, netSalary: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Pay Date"
            fullWidth
            type="date"
            value={formData.payDate}
            onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPayroll ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PayrollPage;
