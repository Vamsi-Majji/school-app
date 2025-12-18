const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const payrollFilePath = path.join(__dirname, '../data/payroll.json');

// Helper function to read payroll data
const readPayrollData = () => {
  try {
    const data = fs.readFileSync(payrollFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading payroll data:', error);
    return [];
  }
};

// Helper function to write payroll data
const writePayrollData = (data) => {
  try {
    fs.writeFileSync(payrollFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing payroll data:', error);
  }
};

// GET /api/payroll - Get all payroll records
router.get('/', (req, res) => {
  const payroll = readPayrollData();
  res.json(payroll);
});

// POST /api/payroll - Create a new payroll record
router.post('/', (req, res) => {
  const payroll = readPayrollData();
  const newPayroll = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  payroll.push(newPayroll);
  writePayrollData(payroll);
  res.status(201).json(newPayroll);
});

// PUT /api/payroll/:id - Update a payroll record
router.put('/:id', (req, res) => {
  const payroll = readPayrollData();
  const payrollIndex = payroll.findIndex(record => record.id === req.params.id);
  if (payrollIndex !== -1) {
    payroll[payrollIndex] = { ...payroll[payrollIndex], ...req.body, updatedAt: new Date().toISOString() };
    writePayrollData(payroll);
    res.json(payroll[payrollIndex]);
  } else {
    res.status(404).json({ message: 'Payroll record not found' });
  }
});

// DELETE /api/payroll/:id - Delete a payroll record
router.delete('/:id', (req, res) => {
  const payroll = readPayrollData();
  const filteredPayroll = payroll.filter(record => record.id !== req.params.id);
  if (filteredPayroll.length !== payroll.length) {
    writePayrollData(filteredPayroll);
    res.json({ message: 'Payroll record deleted successfully' });
  } else {
    res.status(404).json({ message: 'Payroll record not found' });
  }
});

// POST /api/payroll/generate - Generate payslips for all employees
router.post('/generate', (req, res) => {
  // Logic to generate payslips
  // This would calculate salaries based on attendance, allowances, deductions, etc.
  res.json({ message: 'Payslips generated successfully' });
});

module.exports = router;
