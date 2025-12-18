import React, { useState, useEffect } from 'react';

const PermissionManager = ({ role }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Mock data
    setPermissions([
      { id: 1, type: 'Extra Class', student: 'Student 1', status: 'pending' },
      { id: 2, type: 'Disciplinary Action', student: 'Student 2', status: 'approved' }
    ]);
  }, []);

  const approvePermission = (id) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  const denyPermission = (id) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, status: 'denied' } : p));
  };

  return (
    <div className="permission-manager">
      <h3>Permissions</h3>
      <div className="permissions-list">
        {permissions.map(p => (
          <div key={p.id} className="permission-item">
            <p>{p.type} for {p.student}</p>
            <span className={`status ${p.status}`}>{p.status}</span>
            {role === 'principal' && p.status === 'pending' && (
              <div>
                <button onClick={() => approvePermission(p.id)}>Approve</button>
                <button onClick={() => denyPermission(p.id)}>Deny</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionManager;
