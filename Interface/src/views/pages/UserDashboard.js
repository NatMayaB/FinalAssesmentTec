import React from 'react';

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Welcome</h2>
          <p>This is your personal dashboard where you can view your information and activities.</p>
        </div>

        <div className="dashboard-section">
          <h2>Your Information</h2>
          <div className="user-info">
            {/* Add user information display here */}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {/* Add user's recent activity list here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 