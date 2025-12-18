const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const classesPath = path.join(__dirname, '../data/classes.json');

// Helper function to read classes
const readClasses = () => {
  const data = fs.readFileSync(classesPath);
  return JSON.parse(data);
};

// Helper function to write classes
const writeClasses = (classes) => {
  fs.writeFileSync(classesPath, JSON.stringify(classes, null, 2));
};

// Get all classes
router.get('/', auth, (req, res) => {
  const classes = readClasses();
  if (req.user.role === 'principal') {
    const filteredClasses = classes.filter(c => c.schoolName === req.user.schoolName);
    res.json(filteredClasses);
  } else {
    res.json(classes);
  }
});

// Create class
router.post('/', auth, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'principal') {
    return res.status(403).json({ message: 'Access denied' });
  }
  const { name, teacherId } = req.body;
  const classes = readClasses();
  const newClass = { id: classes.length + 1, name, teacherId };
  classes.push(newClass);
  writeClasses(classes);
  res.status(201).json(newClass);
});

module.exports = router;
