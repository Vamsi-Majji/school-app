const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const departmentsFilePath = path.join(__dirname, '../data/departments.json');

// Helper function to read departments data
const readDepartments = () => {
  try {
    const data = fs.readFileSync(departmentsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading departments data:', error);
    return [];
  }
};

// Helper function to write departments data
const writeDepartments = (data) => {
  try {
    fs.writeFileSync(departmentsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing departments data:', error);
  }
};

// GET /api/departments - Get all departments
router.get('/', (req, res) => {
  try {
    const departments = readDepartments();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

// GET /api/departments/:id - Get department by ID
router.get('/:id', (req, res) => {
  try {
    const departments = readDepartments();
    const department = departments.find(d => d.id === parseInt(req.params.id));
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department' });
  }
});

// POST /api/departments - Create new department
router.post('/', (req, res) => {
  try {
    const departments = readDepartments();
    const newDepartment = {
      id: departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    departments.push(newDepartment);
    writeDepartments(departments);
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating department' });
  }
});

// PUT /api/departments/:id - Update department
router.put('/:id', (req, res) => {
  try {
    const departments = readDepartments();
    const index = departments.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Department not found' });
    }
    departments[index] = { ...departments[index], ...req.body, updatedAt: new Date().toISOString() };
    writeDepartments(departments);
    res.json(departments[index]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating department' });
  }
});

// DELETE /api/departments/:id - Delete department
router.delete('/:id', (req, res) => {
  try {
    const departments = readDepartments();
    const filteredDepartments = departments.filter(d => d.id !== parseInt(req.params.id));
    if (filteredDepartments.length === departments.length) {
      return res.status(404).json({ message: 'Department not found' });
    }
    writeDepartments(filteredDepartments);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department' });
  }
});

module.exports = router;
