const express = require('express');
const router = express.Router();

// IoT integration routes
router.get('/', (req, res) => {
  res.json({ message: 'IoT integration endpoint' });
});

router.post('/devices', (req, res) => {
  res.json({ message: 'Register IoT device' });
});

module.exports = router;
