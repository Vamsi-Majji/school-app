const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Get dashboard data for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // Check if user is approved
    if (!req.user.approved) {
      return res.status(403).json({ message: 'Your account is pending approval. Please contact your principal.' });
    }

    let dashboardData = {};

    if (role === 'student') {
      const [assignmentsData, gradesData, attendancesData] = await Promise.all([
        fs.readFile(path.join(__dirname, '../data/assignments.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/grades.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/attendances.json'), 'utf8')
      ]);
      const assignments = JSON.parse(assignmentsData);
      const grades = JSON.parse(gradesData);
      const attendances = JSON.parse(attendancesData);

      const userAssignments = assignments.filter(a => a.studentId === userId);
      const userGrades = grades.filter(g => g.studentId === userId);
      const userAttendances = attendances.filter(a => a.studentId === userId);

      dashboardData = {
        totalAssignments: userAssignments.length,
        completedAssignments: userAssignments.filter(a => a.status === 'completed').length,
        pendingAssignments: userAssignments.filter(a => a.status === 'pending').length,
        averageGrade: userGrades.length > 0 ? (userGrades.reduce((sum, g) => sum + g.grade, 0) / userGrades.length).toFixed(2) : 0,
        attendanceRate: userAttendances.length > 0 ? ((userAttendances.filter(a => a.status === 'present').length / userAttendances.length) * 100).toFixed(2) : 0,
        recentAssignments: userAssignments.slice(-5).reverse(),
        recentGrades: userGrades.slice(-5).reverse()
      };
    } else if (role === 'teacher') {
      const [assignmentsData, gradesData, usersData] = await Promise.all([
        fs.readFile(path.join(__dirname, '../data/assignments.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/grades.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8')
      ]);
      const assignments = JSON.parse(assignmentsData);
      const grades = JSON.parse(gradesData);
      const users = JSON.parse(usersData);

      const teacherAssignments = assignments.filter(a => a.teacherId === userId);
      const teacherGrades = grades.filter(g => teacherAssignments.some(a => a.studentId === g.studentId && a.subjectId === g.subjectId));
      const students = users.filter(u => u.role === 'student' && teacherAssignments.some(a => a.studentId === u.id));

      dashboardData = {
        totalAssignments: teacherAssignments.length,
        pendingAssignments: teacherAssignments.filter(a => a.status === 'pending').length,
        totalStudents: students.length,
        averageClassGrade: teacherGrades.length > 0 ? (teacherGrades.reduce((sum, g) => sum + g.grade, 0) / teacherGrades.length).toFixed(2) : 0,
        recentActivities: teacherAssignments.slice(-5).reverse()
      };
    } else if (role === 'parent') {
      const usersData = await fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8');
      const users = JSON.parse(usersData);
      const children = users.filter(u => u.role === 'student' && u.parentId === userId);

      dashboardData = {
        children: children.map(c => ({ id: c.id, name: c.name, grade: c.grade }))
      };
    } else if (role === 'principal') {
      const [usersData, gradesData, classesData] = await Promise.all([
        fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/grades.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/classes.json'), 'utf8')
      ]);
      const users = JSON.parse(usersData);
      const grades = JSON.parse(gradesData);
      const classes = JSON.parse(classesData);

      const schoolName = req.user.schoolName;
      const schoolUsers = users.filter(u => u.schoolName === schoolName);
      const schoolGrades = grades.filter(g => schoolUsers.some(u => u.id === g.studentId));
      const schoolClasses = classes.filter(c => c.schoolName === schoolName);

      dashboardData = {
        totalStudents: schoolUsers.filter(u => u.role === 'student').length,
        totalTeachers: schoolUsers.filter(u => u.role === 'teacher').length,
        totalClasses: schoolClasses.length,
        averageSchoolGrade: schoolGrades.length > 0 ? (schoolGrades.reduce((sum, g) => sum + g.grade, 0) / schoolGrades.length).toFixed(2) : 0
      };
    } else if (role === 'attender') {
      const attendancesData = await fs.readFile(path.join(__dirname, '../data/attendances.json'), 'utf8');
      const attendances = JSON.parse(attendancesData);

      dashboardData = {
        totalAttendances: attendances.length,
        presentToday: attendances.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'present').length,
        absentToday: attendances.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'absent').length
      };
    } else if (role === 'admin') {
      const [usersData, assignmentsData, gradesData, attendancesData, notificationsData] = await Promise.all([
        fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/assignments.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/grades.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/attendances.json'), 'utf8'),
        fs.readFile(path.join(__dirname, '../data/notifications.json'), 'utf8')
      ]);
      const users = JSON.parse(usersData);
      const assignments = JSON.parse(assignmentsData);
      const grades = JSON.parse(gradesData);
      const attendances = JSON.parse(attendancesData);
      const notifications = JSON.parse(notificationsData);

      dashboardData = {
        totalUsers: users.length,
        totalStudents: users.filter(u => u.role === 'student').length,
        totalTeachers: users.filter(u => u.role === 'teacher').length,
        totalAssignments: assignments.length,
        totalGrades: grades.length,
        totalAttendances: attendances.length,
        totalNotifications: notifications.length,
        averageGrade: grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2) : 0
      };
    }

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;
