const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const auth = require('../middleware/auth');

// Helper function to read application data
const readApplication = async () => {
  const data = await fs.readFile(path.join(__dirname, '../data/application.json'), 'utf8');
  return JSON.parse(data);
};

// Helper function to write application data
const writeApplication = async (application) => {
  await fs.writeFile(path.join(__dirname, '../data/application.json'), JSON.stringify(application, null, 2));
};

// Get application settings (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const application = await readApplication();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application settings' });
  }
});

// Update application settings (admin only)
router.put('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const currentApplication = await readApplication();
    const updatedApplication = { ...currentApplication, ...req.body };
    await writeApplication(updatedApplication);
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application settings' });
  }
});

module.exports = router;
