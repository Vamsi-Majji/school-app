const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const feesPath = path.join(__dirname, '../data/fees.json');

// Helper function to read fees
const readFees = async () => {
  try {
    const data = await fs.readFile(feesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write fees
const writeFees = async (fees) => {
  await fs.writeFile(feesPath, JSON.stringify(fees, null, 2));
};

// Get all fees for school
router.get('/', async (req, res) => {
  try {
    const fees = await readFees();
    const schoolFees = fees.filter(fee => fee.schoolName === req.user.schoolName);
    res.json(schoolFees);
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create fee structure
router.post('/', async (req, res) => {
  try {
    const { className, feeType, amount, frequency, dueDate } = req.body;
    const fees = await readFees();

    const newFee = {
      id: fees.length + 1,
      schoolName: req.user.schoolName,
      className,
      feeType,
      amount,
      frequency,
      dueDate,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    fees.push(newFee);
    await writeFees(fees);
    res.json(newFee);
  } catch (error) {
    console.error('Create fee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update fee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const fees = await readFees();

    const feeIndex = fees.findIndex(fee => fee.id == id && fee.schoolName === req.user.schoolName);
    if (feeIndex === -1) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    fees[feeIndex] = { ...fees[feeIndex], ...updates };
    await writeFees(fees);
    res.json(fees[feeIndex]);
  } catch (error) {
    console.error('Update fee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete fee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fees = await readFees();

    const feeIndex = fees.findIndex(fee => fee.id == id && fee.schoolName === req.user.schoolName);
    if (feeIndex === -1) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    fees.splice(feeIndex, 1);
    await writeFees(fees);
    res.json({ message: 'Fee deleted successfully' });
  } catch (error) {
    console.error('Delete fee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
