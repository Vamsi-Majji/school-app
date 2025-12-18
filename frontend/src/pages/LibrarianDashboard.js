import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Chart from '../components/Chart';
import './Dashboard.css';

const LibrarianDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksIssued: 0,
    booksReturned: 0,
    overdueBooks: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchLibrarianData();
  }, []);

  const fetchLibrarianData = async () => {
    try {
      // Mock library data - in real app, this would come from API
      setStats({
        totalBooks: 25000,
        booksIssued: 1250,
        booksReturned: 1180,
        overdueBooks: 45
      });

      setRecentActivities([
        { id: 1, type: 'issue', message: 'Book "Data Structures" issued to John Doe', time: '30 min ago' },
        { id: 2, type: 'return', message: 'Book "Algorithms" returned by Jane Smith', time: '2 hours ago' },
        { id: 3, type: 'overdue', message: 'Overdue notice sent to 5 students', time: '1 day ago' }
      ]);

    } catch (error) {
      console.error('Error fetching librarian data:', error);
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Books Issued',
      data: [45, 52, 38, 61, 55, 28],
      backgroundColor: '#4CAF50'
    }, {
      label: 'Books Returned',
      data: [42, 48, 35, 58, 51, 25],
      backgroundColor: '#2196F3'
    }]
  };

  return (
    <div className="dashboard">
      <Sidebar user={user} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, Librarian {user.firstName || user.username}!</h1>
          <p>Manage library resources and book circulation</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalBooks.toLocaleString()}</h3>
            <p>Total Books</p>
          </div>
          <div className="stat-card">
            <h3>{stats.booksIssued}</h3>
            <p>Books Issued Today</p>
          </div>
          <div className="stat-card">
            <h3>{stats.booksReturned}</h3>
            <p>Books Returned Today</p>
          </div>
          <div className="stat-card">
            <h3>{stats.overdueBooks}</h3>
            <p>Overdue Books</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="chart-container">
            <h2>Weekly Book Circulation</h2>
            <Chart data={chartData} type="bar" />
          </div>

          <div className="recent-activities">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'issue' && '📖'}
                    {activity.type === 'return' && '↩️'}
                    {activity.type === 'overdue' && '⚠️'}
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
            <button className="action-btn">Issue Book</button>
            <button className="action-btn">Return Book</button>
            <button className="action-btn">Add New Book</button>
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

export default connect(mapStateToProps)(LibrarianDashboard);
