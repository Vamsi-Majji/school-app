const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get all assignments
router.get('/', (req, res) => {
  try {
    const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/assignments.json')));
    const userId = req.user.id;
    const role = req.user.role;

    let filteredAssignments = assignments;

    if (role === 'student') {
      filteredAssignments = assignments.filter(a => a.studentId === userId);
    } else if (role === 'teacher') {
      filteredAssignments = assignments.filter(a => a.teacherId === userId);
    } else if (role === 'principal') {
      filteredAssignments = assignments.filter(a => a.schoolName === req.user.schoolName);
    }

    res.json(filteredAssignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

// Create new assignment (teacher only)
router.post('/', (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create assignments' });
    }

    const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/assignments.json')));
    const newAssignment = {
      id: Date.now().toString(),
      ...req.body,
      teacherId: req.user.id,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    assignments.push(newAssignment);
    fs.writeFileSync(path.join(__dirname, '../data/assignments.json'), JSON.stringify(assignments, null, 2));

    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment' });
  }
});

// Update assignment status (student submission)
router.put('/:id', (req, res) => {
  try {
    const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/assignments.json')));
    const assignmentIndex = assignments.findIndex(a => a.id === req.params.id);

    if (assignmentIndex === -1) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const assignment = assignments[assignmentIndex];

    // Check permissions
    if (req.user.role === 'student' && assignment.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'teacher' && assignment.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    assignments[assignmentIndex] = { ...assignment, ...req.body };
    fs.writeFileSync(path.join(__dirname, '../data/assignments.json'), JSON.stringify(assignments, null, 2));

    res.json(assignments[assignmentIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment' });
  }
});

module.exports = router;
