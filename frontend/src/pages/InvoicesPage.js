import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const generateInvoice = async (studentId) => {
    try {
      await axios.post('/api/invoices/generate', { studentId });
      fetchInvoices();
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const recordPayment = async (invoiceId, amount) => {
    try {
      await axios.post(`/api/invoices/${invoiceId}/payment`, { amount });
      fetchInvoices();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invoices & Fee Collection
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invoice Management
              </Typography>
              <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                Generate Bulk Invoices
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice ID</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.studentName}</TableCell>
                        <TableCell>${invoice.amount}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <Chip label={invoice.status} color={getStatusColor(invoice.status)} />
                        </TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => recordPayment(invoice.id, invoice.amount)}>
                            Record Payment
                          </Button>
                          <Button size="small" color="secondary">
                            View Receipt
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

export default InvoicesPage;
