const express = require('express');
const router = express.Router();

// Virtual classroom routes
router.get('/', (req, res) => {
  res.json({ message: 'Virtual classroom endpoint' });
});

router.post('/rooms', (req, res) => {
  res.json({ message: 'Create virtual classroom' });
});

module.exports = router;
