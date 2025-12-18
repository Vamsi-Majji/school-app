const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const auth = require('../middleware/auth');

// Helper function to read schools data
const readSchools = async () => {
  const data = await fs.readFile(path.join(__dirname, '../data/schools.json'), 'utf8');
  return JSON.parse(data);
};

// Helper function to write schools data
const writeSchools = async (schools) => {
  await fs.writeFile(path.join(__dirname, '../data/schools.json'), JSON.stringify(schools, null, 2));
};

// Helper function to read application data
const readApplication = async () => {
  const data = await fs.readFile(path.join(__dirname, '../data/application.json'), 'utf8');
  return JSON.parse(data);
};

// Get all schools (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const schools = await readSchools();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schools' });
  }
});

// Get school by ID (admin or principal of that school)
router.get('/:id', auth, async (req, res) => {
  try {
    const schools = await readSchools();
    const school = schools.find(s => s.id === parseInt(req.params.id));
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (req.user.role !== 'admin' && req.user.schoolName !== school.name) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching school' });
  }
});

// Create new school (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const schools = await readSchools();
    const newSchool = {
      id: schools.length + 1,
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      principalId: req.body.principalId,
      customFields: req.body.customFields || {}
    };
    schools.push(newSchool);
    await writeSchools(schools);
    res.status(201).json(newSchool);
  } catch (error) {
    res.status(500).json({ message: 'Error creating school' });
  }
});

// Update school (admin or principal of that school)
router.put('/:id', auth, async (req, res) => {
  try {
    const schools = await readSchools();
    const schoolIndex = schools.findIndex(s => s.id === parseInt(req.params.id));
    if (schoolIndex === -1) {
      return res.status(404).json({ message: 'School not found' });
    }
    if (req.user.role !== 'admin' && req.user.schoolName !== schools[schoolIndex].name) {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Check if in single school mode and user is admin
    const application = await readApplication();
    if (req.user.role === 'admin' && !application.multiSchoolMode) {
      return res.status(403).json({ message: 'School management is disabled in single school mode' });
    }
    const updatedSchool = { ...schools[schoolIndex], ...req.body };
    schools[schoolIndex] = updatedSchool;
    await writeSchools(schools);
    res.json(updatedSchool);
  } catch (error) {
    res.status(500).json({ message: 'Error updating school' });
  }
});

// Delete school (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const schools = await readSchools();
    const schoolIndex = schools.findIndex(s => s.id === parseInt(req.params.id));
    if (schoolIndex === -1) {
      return res.status(404).json({ message: 'School not found' });
    }
    schools.splice(schoolIndex, 1);
    await writeSchools(schools);
    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting school' });
  }
});

module.exports = router;
