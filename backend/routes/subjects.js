const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const subjectsPath = path.join(__dirname, '../data/subjects.json');

// Helper function to read subjects
const readSubjects = async () => {
  const data = await fs.readFile(subjectsPath, 'utf8');
  return JSON.parse(data);
};

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await readSubjects();
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const subjects = await readSubjects();
    const subject = subjects.find(s => s.id === parseInt(req.params.id));
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
