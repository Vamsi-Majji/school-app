const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const analyticsFilePath = path.join(__dirname, '../data/analytics.json');

// Helper function to read analytics data
const readAnalytics = () => {
  try {
    const data = fs.readFileSync(analyticsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading analytics data:', error);
    return [];
  }
};

// Helper function to write analytics data
const writeAnalytics = (data) => {
  try {
    fs.writeFileSync(analyticsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing analytics data:', error);
  }
};

// AI-powered student performance prediction
const predictStudentPerformance = (studentId, grades, attendance) => {
  // Simple AI simulation - in real app, this would use ML models
  const avgGrade = grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length;
  const attendanceRate = attendance.present / (attendance.present + attendance.absent);

  let predictedGPA = avgGrade / 25; // Convert to 4.0 scale
  let confidence = 0.8;
  let riskFactors = [];
  let recommendations = [];

  if (attendanceRate < 0.8) {
    riskFactors.push("low attendance");
    recommendations.push("attendance improvement program");
    predictedGPA -= 0.2;
    confidence -= 0.1;
  }

  if (avgGrade < 70) {
    riskFactors.push("inconsistent grades");
    recommendations.push("extra tutoring sessions");
    predictedGPA -= 0.3;
    confidence -= 0.15;
  }

  return {
    predictedGPA: Math.max(0, Math.min(4.0, predictedGPA)),
    confidence: Math.max(0, confidence),
    riskFactors,
    recommendations
  };
};

// GET /api/analytics - Get all analytics data
router.get('/', (req, res) => {
  try {
    const analytics = readAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// GET /api/analytics/predict/:studentId - Predict student performance
router.get('/predict/:studentId', (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const grades = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grades.json'), 'utf8'));
    const attendances = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/attendances.json'), 'utf8'));

    const studentGrades = grades.filter(g => g.studentId === studentId);
    const studentAttendance = attendances.filter(a => a.studentId === studentId);

    if (studentGrades.length === 0) {
      return res.status(404).json({ message: 'No grade data found for student' });
    }

    const attendanceSummary = studentAttendance.reduce(
      (acc, curr) => {
        acc.present += curr.status === 'present' ? 1 : 0;
        acc.absent += curr.status === 'absent' ? 1 : 0;
        return acc;
      },
      { present: 0, absent: 0 }
    );

    const prediction = predictStudentPerformance(studentId, studentGrades, attendanceSummary);

    const result = {
      id: Date.now(),
      type: 'student_performance_prediction',
      schoolId: 1,
      data: {
        studentId,
        ...prediction,
        generatedAt: new Date().toISOString()
      }
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error generating prediction' });
  }
});

// GET /api/analytics/trends/:subject - Get subject performance trends
router.get('/trends/:subject', (req, res) => {
  try {
    const subject = req.params.subject;
    const grades = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grades.json'), 'utf8'));

    const subjectGrades = grades.filter(g => g.subject.toLowerCase() === subject.toLowerCase());

    if (subjectGrades.length === 0) {
      return res.status(404).json({ message: 'No data found for subject' });
    }

    const averageScore = subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length;
    const trend = averageScore > 75 ? 'improving' : averageScore > 60 ? 'stable' : 'declining';

    const result = {
      id: Date.now(),
      type: 'trend_analysis',
      schoolId: 1,
      data: {
        subject,
        trend,
        averageScore: Math.round(averageScore * 100) / 100,
        changePercentage: 8.5, // Mock data - would calculate from historical data
        timeframe: 'last_semester',
        insights: trend === 'improving' ? ['consistent improvement', 'effective teaching methods'] : ['needs attention', 'additional resources required']
      }
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error generating trend analysis' });
  }
});

// POST /api/analytics - Create new analytics entry
router.post('/', (req, res) => {
  try {
    const analytics = readAnalytics();
    const newAnalytics = {
      id: analytics.length > 0 ? Math.max(...analytics.map(a => a.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    analytics.push(newAnalytics);
    writeAnalytics(analytics);
    res.status(201).json(newAnalytics);
  } catch (error) {
    res.status(500).json({ message: 'Error creating analytics entry' });
  }
});

module.exports = router;
