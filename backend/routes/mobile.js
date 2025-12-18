const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Mobile-specific data files
const pushTokensFilePath = path.join(__dirname, '../data/push_tokens.json');
const offlineDataFilePath = path.join(__dirname, '../data/offline_data.json');
const mobileSessionsFilePath = path.join(__dirname, '../data/mobile_sessions.json');

// Helper functions
const readPushTokens = () => {
  try {
    const data = fs.readFileSync(pushTokensFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading push tokens data:', error);
    return [];
  }
};

const writePushTokens = (data) => {
  try {
    fs.writeFileSync(pushTokensFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing push tokens data:', error);
  }
};

const readOfflineData = () => {
  try {
    const data = fs.readFileSync(offlineDataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading offline data:', error);
    return [];
  }
};

const writeOfflineData = (data) => {
  try {
    fs.writeFileSync(offlineDataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing offline data:', error);
  }
};

const readMobileSessions = () => {
  try {
    const data = fs.readFileSync(mobileSessionsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mobile sessions data:', error);
    return [];
  }
};

const writeMobileSessions = (data) => {
  try {
    fs.writeFileSync(mobileSessionsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing mobile sessions data:', error);
  }
};

// Generate device-specific JWT token
const generateDeviceToken = (userId, deviceId, deviceInfo) => {
  return jwt.sign(
    {
      userId,
      deviceId,
      deviceInfo,
      type: 'mobile',
      iat: Math.floor(Date.now() / 1000)
    },
    'mobile-secret-key-2024', // In production, use environment variable
    { expiresIn: '365d' } // Long expiry for mobile devices
  );
};

// Push Notifications Routes

// POST /api/mobile/push/register - Register device for push notifications
router.post('/push/register', (req, res) => {
  try {
    const { userId, deviceToken, deviceType, deviceId } = req.body;
    const pushTokens = readPushTokens();

    // Remove existing token for this device
    const filteredTokens = pushTokens.filter(token =>
      !(token.userId === userId && token.deviceId === deviceId)
    );

    const newToken = {
      id: Date.now(),
      userId: parseInt(userId),
      deviceToken,
      deviceType: deviceType || 'ios', // ios, android, web
      deviceId,
      registeredAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      active: true
    };

    filteredTokens.push(newToken);
    writePushTokens(filteredTokens);

    res.json({
      success: true,
      message: 'Device registered for push notifications',
      tokenId: newToken.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering device for push notifications' });
  }
});

// POST /api/mobile/push/send - Send push notification (admin only)
router.post('/push/send', (req, res) => {
  try {
    const { userIds, title, message, data, priority } = req.body;
    const pushTokens = readPushTokens();

    // In a real implementation, this would integrate with FCM/APNS
    // For simulation, we'll just log the notification
    const notifications = userIds.map(userId => {
      const userTokens = pushTokens.filter(token =>
        token.userId === userId && token.active
      );

      return {
        userId,
        tokens: userTokens.length,
        notification: {
          title,
          message,
          data: data || {},
          priority: priority || 'normal',
          sentAt: new Date().toISOString()
        }
      };
    });

    // Simulate sending notifications
    const results = {
      totalUsers: userIds.length,
      totalTokens: notifications.reduce((sum, n) => sum + n.tokens, 0),
      sent: notifications.filter(n => n.tokens > 0).length,
      failed: notifications.filter(n => n.tokens === 0).length,
      notifications
    };

    res.json({
      success: true,
      message: 'Push notifications queued for sending',
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending push notifications' });
  }
});

// DELETE /api/mobile/push/unregister - Unregister device
router.delete('/push/unregister', (req, res) => {
  try {
    const { userId, deviceId } = req.body;
    const pushTokens = readPushTokens();

    const filteredTokens = pushTokens.filter(token =>
      !(token.userId === userId && token.deviceId === deviceId)
    );

    writePushTokens(filteredTokens);

    res.json({
      success: true,
      message: 'Device unregistered from push notifications'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error unregistering device' });
  }
});

// Offline Data Routes

// GET /api/mobile/offline/sync - Get data for offline sync
router.get('/offline/sync', (req, res) => {
  try {
    const { userId, lastSync } = req.query;
    const userIdNum = parseInt(userId);
    const lastSyncDate = lastSync ? new Date(lastSync) : new Date(0);

    // Gather data that changed since last sync
    const syncData = {
      userId: userIdNum,
      lastSync: lastSyncDate.toISOString(),
      currentSync: new Date().toISOString(),
      data: {}
    };

    // Get user's classes
    const classes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/classes.json'), 'utf8'));
    const userClasses = classes.filter(c =>
      c.students && c.students.includes(userIdNum) ||
      c.teacherId === userIdNum
    ).filter(c => new Date(c.updatedAt || c.createdAt) > lastSyncDate);

    // Get user's assignments
    const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/assignments.json'), 'utf8'));
    const userAssignments = assignments.filter(a =>
      a.classId && userClasses.some(c => c.id === a.classId) ||
      a.studentId === userIdNum
    ).filter(a => new Date(a.updatedAt || a.createdAt) > lastSyncDate);

    // Get user's grades
    const grades = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grades.json'), 'utf8'));
    const userGrades = grades.filter(g => g.studentId === userIdNum)
      .filter(g => new Date(g.updatedAt || g.createdAt) > lastSyncDate);

    // Get notifications
    const notifications = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/notifications.json'), 'utf8'));
    const userNotifications = notifications.filter(n =>
      n.userId === userIdNum || n.userId === 'all'
    ).filter(n => new Date(n.createdAt) > lastSyncDate);

    syncData.data = {
      classes: userClasses,
      assignments: userAssignments,
      grades: userGrades,
      notifications: userNotifications
    };

    res.json(syncData);
  } catch (error) {
    res.status(500).json({ message: 'Error syncing offline data' });
  }
});

// POST /api/mobile/offline/upload - Upload offline changes
router.post('/offline/upload', (req, res) => {
  try {
    const { userId, changes } = req.body;
    const offlineData = readOfflineData();

    const uploadRecord = {
      id: Date.now(),
      userId: parseInt(userId),
      changes,
      uploadedAt: new Date().toISOString(),
      processed: false
    };

    offlineData.push(uploadRecord);
    writeOfflineData(offlineData);

    // In a real app, this would trigger background processing
    // For now, we'll simulate processing
    setTimeout(() => {
      uploadRecord.processed = true;
      uploadRecord.processedAt = new Date().toISOString();
      writeOfflineData(offlineData);
    }, 1000);

    res.json({
      success: true,
      message: 'Offline changes uploaded successfully',
      uploadId: uploadRecord.id,
      pendingProcessing: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading offline changes' });
  }
});

// Mobile Sessions Routes

// POST /api/mobile/auth/device - Authenticate device
router.post('/auth/device', (req, res) => {
  try {
    const { userId, deviceId, deviceInfo } = req.body;
    const mobileSessions = readMobileSessions();

    // Generate device token
    const deviceToken = generateDeviceToken(userId, deviceId, deviceInfo);

    const session = {
      id: Date.now(),
      userId: parseInt(userId),
      deviceId,
      deviceInfo,
      deviceToken,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      active: true
    };

    mobileSessions.push(session);
    writeMobileSessions(mobileSessions);

    res.json({
      success: true,
      message: 'Device authenticated successfully',
      session,
      token: deviceToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating device' });
  }
});

// POST /api/mobile/auth/verify - Verify device token
router.post('/auth/verify', (req, res) => {
  try {
    const { deviceToken } = req.body;

    jwt.verify(deviceToken, 'mobile-secret-key-2024', (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired device token'
        });
      }

      // Update last activity
      const mobileSessions = readMobileSessions();
      const sessionIndex = mobileSessions.findIndex(s =>
        s.deviceId === decoded.deviceId && s.active
      );

      if (sessionIndex !== -1) {
        mobileSessions[sessionIndex].lastActivity = new Date().toISOString();
        writeMobileSessions(mobileSessions);
      }

      res.json({
        success: true,
        message: 'Device token verified',
        user: decoded
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying device token' });
  }
});

// Dashboard Routes for Mobile

// GET /api/mobile/dashboard - Mobile-optimized dashboard
router.get('/dashboard', (req, res) => {
  try {
    const { userId, userRole } = req.query;
    const userIdNum = parseInt(userId);

    const dashboard = {
      userId: userIdNum,
      role: userRole,
      generatedAt: new Date().toISOString(),
      sections: []
    };

    // Quick actions based on role
    if (userRole === 'student') {
      // Get student's classes and assignments
      const classes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/classes.json'), 'utf8'));
      const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/assignments.json'), 'utf8'));
      const grades = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grades.json'), 'utf8'));

      const studentClasses = classes.filter(c => c.students && c.students.includes(userIdNum));
      const pendingAssignments = assignments.filter(a =>
        a.classId && studentClasses.some(c => c.id === a.classId) &&
        new Date(a.dueDate) > new Date() &&
        (!a.submissions || !a.submissions.some(s => s.studentId === userIdNum))
      );
      const recentGrades = grades.filter(g => g.studentId === userIdNum)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      dashboard.sections = [
        {
          type: 'quick_actions',
          title: 'Quick Actions',
          actions: [
            { id: 'view_grades', label: 'View Grades', icon: 'grade' },
            { id: 'submit_assignment', label: 'Submit Assignment', icon: 'upload' },
            { id: 'join_class', label: 'Join Virtual Class', icon: 'video' }
          ]
        },
        {
          type: 'upcoming',
          title: 'Upcoming Deadlines',
          items: pendingAssignments.slice(0, 3).map(a => ({
            id: a.id,
            title: a.title,
            dueDate: a.dueDate,
            className: studentClasses.find(c => c.id === a.classId)?.name,
            priority: new Date(a.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000) ? 'high' : 'normal'
          }))
        },
        {
          type: 'recent_grades',
          title: 'Recent Grades',
          items: recentGrades.map(g => ({
            id: g.id,
            subject: g.subject,
            score: g.score,
            grade: g.grade,
            date: g.createdAt
          }))
        }
      ];
    } else if (userRole === 'teacher') {
      // Get teacher's classes and pending tasks
      const classes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/classes.json'), 'utf8'));
      const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/assignments.json'), 'utf8'));

      const teacherClasses = classes.filter(c => c.teacherId === userIdNum);
      const pendingGrading = assignments.filter(a =>
        a.teacherId === userIdNum &&
        a.submissions &&
        a.submissions.some(s => !s.graded)
      );

      dashboard.sections = [
        {
          type: 'quick_actions',
          title: 'Quick Actions',
          actions: [
            { id: 'create_assignment', label: 'Create Assignment', icon: 'add' },
            { id: 'grade_submissions', label: 'Grade Submissions', icon: 'grade' },
            { id: 'start_class', label: 'Start Virtual Class', icon: 'video' }
          ]
        },
        {
          type: 'classes',
          title: 'My Classes',
          items: teacherClasses.map(c => ({
            id: c.id,
            name: c.name,
            studentCount: c.students?.length || 0,
            nextClass: c.schedule
          }))
        },
        {
          type: 'pending_tasks',
          title: 'Pending Tasks',
          items: pendingGrading.map(a => ({
            id: a.id,
            title: a.title,
            pendingCount: a.submissions.filter(s => !s.graded).length,
            className: teacherClasses.find(c => c.id === a.classId)?.name
          }))
        }
      ];
    }

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error generating mobile dashboard' });
  }
});

// Analytics Routes for Mobile

// GET /api/mobile/analytics - Mobile-optimized analytics
router.get('/analytics', (req, res) => {
  try {
    const { userId, userRole, timeframe } = req.query;
    const userIdNum = parseInt(userId);
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 1;

    const analytics = {
      userId: userIdNum,
      role: userRole,
      timeframe,
      generatedAt: new Date().toISOString(),
      metrics: {}
    };

    if (userRole === 'student') {
      // Student-specific analytics
      const grades = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grades.json'), 'utf8'));
      const attendances = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/attendances.json'), 'utf8'));

      const studentGrades = grades.filter(g => g.studentId === userIdNum);
      const studentAttendance = attendances.filter(a => a.studentId === userIdNum);

      const recentGrades = studentGrades.filter(g =>
        new Date(g.createdAt) > new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      );

      const attendanceRate = studentAttendance.length > 0 ?
        (studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100 : 0;

      analytics.metrics = {
        averageGrade: recentGrades.length > 0 ?
          recentGrades.reduce((sum, g) => sum + g.score, 0) / recentGrades.length : 0,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        assignmentsCompleted: recentGrades.length,
        gradeTrend: recentGrades.length >= 2 ?
          (recentGrades[0].score > recentGrades[recentGrades.length - 1].score ? 'improving' : 'declining') : 'stable'
      };
    } else if (userRole === 'teacher') {
      // Teacher-specific analytics
      const classes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/classes.json'), 'utf8'));
      const assignments = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/assignments.json'), 'utf8'));

      const teacherClasses = classes.filter(c => c.teacherId === userIdNum);
      const teacherAssignments = assignments.filter(a => a.teacherId === userIdNum);

      analytics.metrics = {
        totalClasses: teacherClasses.length,
        totalStudents: teacherClasses.reduce((sum, c) => sum + (c.students?.length || 0), 0),
        assignmentsCreated: teacherAssignments.length,
        averageClassSize: teacherClasses.length > 0 ?
          teacherClasses.reduce((sum, c) => sum + (c.students?.length || 0), 0) / teacherClasses.length : 0
      };
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error generating mobile analytics' });
  }
});

module.exports = router;
