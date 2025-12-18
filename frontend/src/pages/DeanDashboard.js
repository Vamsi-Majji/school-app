import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Chart from '../components/Chart';
import './Dashboard.css';

const DeanDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalProfessors: 0,
    totalStudents: 0,
    budgetAllocated: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDeanData();
  }, []);

  const fetchDeanData = async () => {
    try {
      // Fetch departments
      const departmentsResponse = await fetch('/api/departments');
      const departments = await departmentsResponse.json();

      // Fetch professors
      const professorsResponse = await fetch('/api/users?role=professor');
      const professors = await professorsResponse.json();

      // Fetch students
      const studentsResponse = await fetch('/api/users?role=student');
      const students = await studentsResponse.json();

      setStats({
        totalDepartments: departments.length,
        totalProfessors: professors.length,
        totalStudents: students.length,
        budgetAllocated: 5000000 // Mock budget
      });

      setRecentActivities([
        { id: 1, type: 'budget', message: 'New budget allocation approved', time: '1 hour ago' },
        { id: 2, type: 'meeting', message: 'Academic council meeting held', time: '1 day ago' },
        { id: 3, type: 'policy', message: 'New academic policy implemented', time: '2 days ago' }
      ]);

    } catch (error) {
      console.error('Error fetching dean data:', error);
    }
  };

  const chartData = {
    labels: ['Computer Science', 'Business', 'Arts', 'Engineering'],
    datasets: [{
      label: 'Department Performance',
      data: [92, 88, 85, 90],
      backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0']
    }]
  };

  return (
    <div className="dashboard">
      <Sidebar user={user} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, Dean {user.firstName || user.username}!</h1>
          <p>Oversee academic affairs and institutional management</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalDepartments}</h3>
            <p>Departments</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalProfessors}</h3>
            <p>Professors</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
          <div className="stat-card">
            <h3>${stats.budgetAllocated.toLocaleString()}</h3>
            <p>Budget Allocated</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="chart-container">
            <h2>Department Performance</h2>
            <Chart data={chartData} type="bar" />
          </div>

          <div className="recent-activities">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'budget' && '💰'}
                    {activity.type === 'meeting' && '📅'}
                    {activity.type === 'policy' && '📋'}
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Approve Budget</button>
            <button className="action-btn">Schedule Meeting</button>
            <button className="action-btn">Review Policies</button>
            <button className="action-btn">Generate Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(DeanDashboard);
