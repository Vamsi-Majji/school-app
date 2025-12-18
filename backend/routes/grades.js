const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const gradesPath = path.join(__dirname, '../data/grades.json');

// Helper function to read grades
const readGrades = () => {
  const data = fs.readFileSync(gradesPath);
  return JSON.parse(data);
};

// Helper function to write grades
const writeGrades = (grades) => {
  fs.writeFileSync(gradesPath, JSON.stringify(grades, null, 2));
};

// Get all grades
router.get('/', auth, (req, res) => {
  const grades = readGrades();
  const userId = req.user.id;
  const role = req.user.role;

  let filteredGrades = grades;

  if (role === 'student') {
    filteredGrades = grades.filter(g => g.studentId === userId);
  } else if (role === 'teacher') {
    filteredGrades = grades.filter(g => g.teacherId === userId);
  } else if (role === 'principal') {
    filteredGrades = grades.filter(g => g.schoolName === req.user.schoolName);
  }

  res.json(filteredGrades);
});

// Create grade
router.post('/', auth, (req, res) => {
  const { studentId, assignmentId, grade } = req.body;
  const grades = readGrades();
  const newGrade = { id: grades.length + 1, studentId, assignmentId, grade };
  grades.push(newGrade);
  writeGrades(grades);
  res.status(201).json(newGrade);
});

module.exports = router;
