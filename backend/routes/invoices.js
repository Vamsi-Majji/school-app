const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const invoicesPath = path.join(__dirname, '../data/invoices.json');

// Helper function to read invoices
const readInvoices = async () => {
  try {
    const data = await fs.readFile(invoicesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write invoices
const writeInvoices = async (invoices) => {
  await fs.writeFile(invoicesPath, JSON.stringify(invoices, null, 2));
};

// Get all invoices for school
router.get('/', async (req, res) => {
  try {
    const invoices = await readInvoices();
    const schoolInvoices = invoices.filter(inv => inv.schoolName === req.user.schoolName);
    res.json(schoolInvoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  try {
    const { studentId, feePlanId, amount, dueDate } = req.body;
    const invoices = await readInvoices();

    const newInvoice = {
      id: invoices.length + 1,
      schoolName: req.user.schoolName,
      studentId,
      feePlanId,
      amount,
      dueDate,
      status: 'unpaid',
      createdAt: new Date().toISOString()
    };

    invoices.push(newInvoice);
    await writeInvoices(invoices);
    res.json(newInvoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update payment status
router.put('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMode, amount } = req.body;
    const invoices = await readInvoices();

    const invoice = invoices.find(inv => inv.id == id && inv.schoolName === req.user.schoolName);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoice.status = 'paid';
    invoice.paymentDate = new Date().toISOString();
    invoice.paymentMode = paymentMode;
    invoice.paidAmount = amount;

    await writeInvoices(invoices);
    res.json(invoice);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
