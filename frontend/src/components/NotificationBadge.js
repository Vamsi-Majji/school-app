import React from 'react';

const NotificationBadge = ({ count }) => {
  return (
    <div className="notification-badge">
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
};

export default NotificationBadge;
