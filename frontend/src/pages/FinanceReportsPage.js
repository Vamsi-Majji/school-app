import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinanceReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`/api/finance-reports?period=${selectedPeriod}`);
      setReports(response.data);
      prepareChartData(response.data);
    } catch (error) {
      console.error('Error fetching finance reports:', error);
    }
  };

  const prepareChartData = (data) => {
    const labels = data.map(item => item.period);
    const feeCollection = data.map(item => item.feeCollection);
    const expenses = data.map(item => item.expenses);
    const payroll = data.map(item => item.payroll);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Fee Collection',
          data: feeCollection,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Expenses',
          data: expenses,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
        {
          label: 'Payroll',
          data: payroll,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    });
  };

  const generateReport = async (type) => {
    try {
      const response = await axios.get(`/api/finance-reports/generate?type=${type}&period=${selectedPeriod}`);
      // Handle PDF generation or download
      console.log('Report generated:', response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Finance Overview',
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Finance Reports
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                MIS Reports
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControl sx={{ mr: 2, minWidth: 120 }}>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={() => generateReport('fee-collection')}>
                  Fee Collection Report
                </Button>
                <Button variant="contained" sx={{ ml: 1 }} onClick={() => generateReport('payroll')}>
                  Payroll Report
                </Button>
                <Button variant="contained" sx={{ ml: 1 }} onClick={() => generateReport('expenses')}>
                  Expenses Report
                </Button>
              </Box>
              <Box sx={{ height: 400, mb: 4 }}>
                {chartData.labels && <Bar options={options} data={chartData} />}
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Fee Collection</TableCell>
                      <TableCell>Expenses</TableCell>
                      <TableCell>Payroll</TableCell>
                      <TableCell>Net Profit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>${report.feeCollection}</TableCell>
                        <TableCell>${report.expenses}</TableCell>
                        <TableCell>${report.payroll}</TableCell>
                        <TableCell>${report.netProfit}</TableCell>
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

export default FinanceReportsPage;
