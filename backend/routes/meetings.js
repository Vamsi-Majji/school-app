const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const meetingsPath = path.join(__dirname, '../data/meetings.json');

// Helper function to read meetings
const readMeetings = () => {
  const data = fs.readFileSync(meetingsPath);
  return JSON.parse(data);
};

// Helper function to write meetings
const writeMeetings = (meetings) => {
  fs.writeFileSync(meetingsPath, JSON.stringify(meetings, null, 2));
};

// Get all meetings
router.get('/', auth, (req, res) => {
  const meetings = readMeetings();
  const userId = req.user.id;
  const role = req.user.role;

  let filteredMeetings = meetings;

  if (role === 'student') {
    filteredMeetings = meetings.filter(m => m.participants.includes(userId));
  } else if (role === 'teacher') {
    filteredMeetings = meetings.filter(m => m.participants.includes(userId) || m.createdBy === userId);
  } else if (role === 'principal') {
    filteredMeetings = meetings.filter(m => m.schoolName === req.user.schoolName);
  }

  res.json(filteredMeetings);
});

// Create meeting
router.post('/', auth, (req, res) => {
  if (req.user.role !== 'principal' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  const { title, date, participants } = req.body;
  const meetings = readMeetings();
  const newMeeting = { id: meetings.length + 1, title, date, participants };
  meetings.push(newMeeting);
  writeMeetings(meetings);
  res.status(201).json(newMeeting);
});

module.exports = router;
