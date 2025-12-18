import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import Chart from '../components/Chart';
import Sidebar from '../components/Sidebar';
import FeeSetupPage from './FeeSetupPage';
import InvoicesPage from './InvoicesPage';
import DuesRefundsPage from './DuesRefundsPage';
import PayrollPage from './PayrollPage';
import ExpensesPage from './ExpensesPage';
import FinanceReportsPage from './FinanceReportsPage';
import CommunicationsPage from './CommunicationsPage';
import FinanceSettingsPage from './FinanceSettingsPage';

const AccountantDashboard = () => {
  const feeCollectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Fee Collection',
      data: [12000, 15000, 18000, 14000, 20000, 22000],
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    }]
  };

  const expenseData = {
    labels: ['Salaries', 'Utilities', 'Maintenance', 'Supplies', 'Others'],
    datasets: [{
      label: 'Monthly Expenses',
      data: [50000, 8000, 12000, 5000, 3000],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const DashboardContent = () => (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Accountant Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Fee Collection Trends</Typography>
              </Box>
              <Chart type="line" data={feeCollectionData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Expense Breakdown</Typography>
              </Box>
              <Chart type="pie" data={expenseData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="accountant" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: isMobile ? 0 : '280px',
          mt: isMobile ? '56px' : 0,
        }}
      >
        <Routes>
          <Route path="" element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="fee-setup" element={<FeeSetupPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="dues-refunds" element={<DuesRefundsPage />} />
          <Route path="payroll" element={<PayrollPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="reports" element={<FinanceReportsPage />} />
          <Route path="communications" element={<CommunicationsPage />} />
          <Route path="settings" element={<FinanceSettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AccountantDashboard;
