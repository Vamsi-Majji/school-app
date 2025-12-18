import React, { useEffect, useState } from 'react';

const RealTimeUpdates = ({ onUpdate }) => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    // Mock real-time updates using setInterval
    const interval = setInterval(() => {
      const newUpdate = {
        id: Date.now(),
        message: 'New update received',
        timestamp: new Date().toLocaleTimeString()
      };
      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep last 10 updates
      if (onUpdate) onUpdate(newUpdate);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [onUpdate]);

  return (
    <div className="real-time-updates">
      <h4>Real-Time Updates</h4>
      <ul>
        {updates.map(update => (
          <li key={update.id}>
            {update.message} - {update.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeUpdates;
