import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/admin/historial')}>
              View Historial
            </button>
            {/* Add more admin actions here */}
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Statistics</h2>
          <div className="stats-container">
            {/* Add statistics components here */}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {/* Add recent activity list here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 