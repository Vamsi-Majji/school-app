import React, { useState, useEffect } from 'react';

const ComplaintSystem = ({ role }) => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState('');

  useEffect(() => {
    // Mock data
    setComplaints([
      { id: 1, description: 'Issue with grading', status: 'pending', submittedBy: 'student' },
      { id: 2, description: 'Classroom maintenance needed', status: 'resolved', submittedBy: 'teacher' }
    ]);
  }, []);

  const submitComplaint = () => {
    if (newComplaint.trim()) {
      const complaint = {
        id: Date.now(),
        description: newComplaint,
        status: 'pending',
        submittedBy: role
      };
      setComplaints([...complaints, complaint]);
      setNewComplaint('');
    }
  };

  const resolveComplaint = (id) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
  };

  return (
    <div className="complaint-system">
      <h3>Complaints</h3>
      {(role === 'student' || role === 'teacher' || role === 'parent') && (
        <div className="submit-complaint">
          <textarea
            value={newComplaint}
            onChange={(e) => setNewComplaint(e.target.value)}
            placeholder="Describe your complaint..."
          />
          <button onClick={submitComplaint}>Submit Complaint</button>
        </div>
      )}
      <div className="complaints-list">
        {complaints.map(c => (
          <div key={c.id} className="complaint-item">
            <p>{c.description}</p>
            <span className={`status ${c.status}`}>{c.status}</span>
            {role === 'principal' && c.status === 'pending' && (
              <button onClick={() => resolveComplaint(c.id)}>Resolve</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintSystem;
