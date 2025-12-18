const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get notifications for user
router.get('/', (req, res) => {
  try {
    const notifications = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/notifications.json')));
    const userId = req.user.id;
    const role = req.user.role;

    let filteredNotifications = notifications.filter(n =>
      n.targetUserId === userId ||
      n.targetUserId === 'all' ||
      n.targetRole === role ||
      n.targetRole === 'all'
    );

    if (role === 'principal') {
      filteredNotifications = filteredNotifications.filter(n => n.schoolName === req.user.schoolName || !n.schoolName);
    }

    res.json(filteredNotifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Create new notification (admin, principal, teacher only)
router.post('/', (req, res) => {
  try {
    if (!['admin', 'principal', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const notifications = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/notifications.json')));
    const newNotification = {
      id: Date.now().toString(),
      ...req.body,
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    notifications.push(newNotification);
    fs.writeFileSync(path.join(__dirname, '../data/notifications.json'), JSON.stringify(notifications, null, 2));

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification' });
  }
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  try {
    const notifications = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/notifications.json')));
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id);

    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const notification = notifications[notificationIndex];

    // Check if user can access this notification
    if (notification.targetUserId !== req.user.id &&
        notification.targetUserId !== 'all' &&
        notification.targetRole !== req.user.role &&
        notification.targetRole !== 'all') {
      return res.status(403).json({ message: 'Access denied' });
    }

    notifications[notificationIndex].read = true;
    fs.writeFileSync(path.join(__dirname, '../data/notifications.json'), JSON.stringify(notifications, null, 2));

    res.json(notifications[notificationIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

module.exports = router;
