const express = require('express');
const cors = require('cors');
const path = require('path');

// Import existing routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const schoolsRouter = require('./routes/schools');
const classesRouter = require('./routes/classes');
const subjectsRouter = require('./routes/subjects');
const assignmentsRouter = require('./routes/assignments');
const gradesRouter = require('./routes/grades');
const attendancesRouter = require('./routes/attendances');
const notificationsRouter = require('./routes/notifications');
const meetingsRouter = require('./routes/meetings');
const departmentsRouter = require('./routes/departments');
const semestersRouter = require('./routes/semesters');
const feesRouter = require('./routes/fees');
const payrollRouter = require('./routes/payroll');
const expensesRouter = require('./routes/expenses');
const invoicesRouter = require('./routes/invoices');

// Import new futuristic routes
const dashboardRouter = require('./routes/dashboard');
const applicationRouter = require('./routes/application');
const analyticsRouter = require('./routes/analytics');
const researchRouter = require('./routes/research');
const alumniRouter = require('./routes/alumni');
const certificatesRouter = require('./routes/certificates');
const careerRouter = require('./routes/career');
const iotRouter = require('./routes/iot');
const virtualRouter = require('./routes/virtual');
const mobileRouter = require('./routes/mobile');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/schools', schoolsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/grades', gradesRouter);
app.use('/api/attendances', attendancesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/semesters', semestersRouter);
app.use('/api/fees', feesRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/invoices', invoicesRouter);

// Futuristic API Routes
app.use('/api/dashboard', dashboardRouter);
app.use('/api/application', applicationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/research', researchRouter);
app.use('/api/alumni', alumniRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/career', careerRouter);
app.use('/api/iot', iotRouter);
app.use('/api/virtual', virtualRouter);
app.use('/api/mobile', mobileRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0-futuristic',
    features: [
      'AI Analytics',
      'Research Management',
      'Alumni Network',
      'Blockchain Certificates',
      'IoT Integration',
      'Virtual Classrooms',
      'Career Counseling',
      'Mobile API'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Futuristic Educational Management System Server running on port ${PORT}`);
  console.log(`📊 AI Analytics & Research Management: ACTIVE`);
  console.log(`🎓 Alumni Network & Career Services: ACTIVE`);
  console.log(`🔐 Blockchain Certificate Verification: ACTIVE`);
  console.log(`📱 IoT Campus Integration: ACTIVE`);
  console.log(`💻 Virtual Learning Ecosystem: ACTIVE`);
  console.log(`🤖 AI Career Counseling: ACTIVE`);
  console.log(`📱 Mobile-First Architecture: ACTIVE`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
