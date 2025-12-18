import React, { useState, useEffect } from 'react';
import Chart from './Chart';

const Gradebook = ({ studentId, role }) => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // Mock data
    setGrades([
      { subject: 'Math', grade: 85, studentId: studentId },
      { subject: 'Science', grade: 90, studentId: studentId },
      { subject: 'English', grade: 88, studentId: studentId }
    ]);
  }, [studentId]);

  const gradeData = {
    labels: grades.map(g => g.subject),
    datasets: [{
      label: 'Grades',
      data: grades.map(g => g.grade),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  const averageGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2) : 0;

  // Mock trend data (up, down, stable)
  const getTrend = (grade) => {
    if (grade > 85) return 'up';
    if (grade < 70) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '⬆️';
      case 'down': return '⬇️';
      default: return '➡️';
    }
  };

  return (
    <div className="gradebook">
      <h3>Gradebook</h3>
      <div className="grade-summary">
        <p>Average Grade: {averageGrade}%</p>
      </div>
      <Chart type="bar" data={gradeData} />
      <div className="grade-table">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Grade (%)</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, index) => (
              <tr key={index}>
                <td>{g.subject}</td>
                <td>{g.grade}%</td>
                <td>{getTrendIcon(getTrend(g.grade))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gradebook;
