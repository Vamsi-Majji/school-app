const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const expensesPath = path.join(__dirname, '../data/expenses.json');

// Helper function to read expenses
const readExpenses = async () => {
  try {
    const data = await fs.readFile(expensesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write expenses
const writeExpenses = async (expenses) => {
  await fs.writeFile(expensesPath, JSON.stringify(expenses, null, 2));
};

// Get all expenses for school
router.get('/', async (req, res) => {
  try {
    const expenses = await readExpenses();
    const schoolExpenses = expenses.filter(exp => exp.schoolName === req.user.schoolName);
    res.json(schoolExpenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create expense
router.post('/', async (req, res) => {
  try {
    const { category, vendorName, amount, description, date, attachments } = req.body;
    const expenses = await readExpenses();

    const newExpense = {
      id: expenses.length + 1,
      schoolName: req.user.schoolName,
      category,
      vendorName,
      amount,
      description,
      date,
      status: 'pending',
      attachments: attachments || [],
      createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    await writeExpenses(expenses);
    res.json(newExpense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update expense status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const expenses = await readExpenses();

    const expense = expenses.find(exp => exp.id == id && exp.schoolName === req.user.schoolName);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.status = status;
    await writeExpenses(expenses);
    res.json(expense);
  } catch (error) {
    console.error('Update expense status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Record vendor payment
router.post('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMode, amount, referenceNumber } = req.body;
    const expenses = await readExpenses();

    const expense = expenses.find(exp => exp.id == id && exp.schoolName === req.user.schoolName);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.payment = {
      mode: paymentMode,
      amount,
      referenceNumber,
      date: new Date().toISOString()
    };
    expense.status = 'paid';

    await writeExpenses(expenses);
    res.json(expense);
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
