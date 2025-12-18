const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const attendancesPath = path.join(__dirname, '../data/attendances.json');

// Helper function to read attendances
const readAttendances = () => {
  const data = fs.readFileSync(attendancesPath);
  return JSON.parse(data);
};

// Helper function to write attendances
const writeAttendances = (attendances) => {
  fs.writeFileSync(attendancesPath, JSON.stringify(attendances, null, 2));
};

// Get all attendances
router.get('/', auth, (req, res) => {
  const attendances = readAttendances();
  const userId = req.user.id;
  const role = req.user.role;

  let filteredAttendances = attendances;

  if (role === 'student') {
    filteredAttendances = attendances.filter(a => a.studentId === userId);
  } else if (role === 'teacher') {
    filteredAttendances = attendances.filter(a => a.teacherId === userId);
  } else if (role === 'principal') {
    filteredAttendances = attendances.filter(a => a.schoolName === req.user.schoolName);
  }

  res.json(filteredAttendances);
});

// Create attendance
router.post('/', auth, (req, res) => {
  const { studentId, date, status } = req.body;
  const attendances = readAttendances();
  const newAttendance = { id: attendances.length + 1, studentId, date, status };
  attendances.push(newAttendance);
  writeAttendances(attendances);
  res.status(201).json(newAttendance);
});

module.exports = router;
