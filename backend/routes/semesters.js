const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const semestersFilePath = path.join(__dirname, '../data/semesters.json');

// Helper function to read semesters data
const readSemesters = () => {
  try {
    const data = fs.readFileSync(semestersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading semesters data:', error);
    return [];
  }
};

// Helper function to write semesters data
const writeSemesters = (data) => {
  try {
    fs.writeFileSync(semestersFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing semesters data:', error);
  }
};

// GET /api/semesters - Get all semesters
router.get('/', (req, res) => {
  try {
    const semesters = readSemesters();
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching semesters' });
  }
});

// GET /api/semesters/:id - Get semester by ID
router.get('/:id', (req, res) => {
  try {
    const semesters = readSemesters();
    const semester = semesters.find(s => s.id === parseInt(req.params.id));
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    res.json(semester);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching semester' });
  }
});

// POST /api/semesters - Create new semester
router.post('/', (req, res) => {
  try {
    const semesters = readSemesters();
    const newSemester = {
      id: semesters.length > 0 ? Math.max(...semesters.map(s => s.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    semesters.push(newSemester);
    writeSemesters(semesters);
    res.status(201).json(newSemester);
  } catch (error) {
    res.status(500).json({ message: 'Error creating semester' });
  }
});

// PUT /api/semesters/:id - Update semester
router.put('/:id', (req, res) => {
  try {
    const semesters = readSemesters();
    const index = semesters.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    semesters[index] = { ...semesters[index], ...req.body, updatedAt: new Date().toISOString() };
    writeSemesters(semesters);
    res.json(semesters[index]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating semester' });
  }
});

// DELETE /api/semesters/:id - Delete semester
router.delete('/:id', (req, res) => {
  try {
    const semesters = readSemesters();
    const filteredSemesters = semesters.filter(s => s.id !== parseInt(req.params.id));
    if (filteredSemesters.length === semesters.length) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    writeSemesters(filteredSemesters);
    res.json({ message: 'Semester deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting semester' });
  }
});

module.exports = router;
