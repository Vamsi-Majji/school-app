import React, { useEffect, useState } from 'react';

const AutomatedReminders = ({ role }) => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    // Mock reminders based on role
    const roleReminders = {
      student: [
        'Submit homework by tomorrow',
        'Parent-teacher meeting next week',
        'Exam preparation session today'
      ],
      teacher: [
        'Grade assignments by Friday',
        'Staff meeting tomorrow',
        'Submit attendance report'
      ],
      parent: [
        'Pick up child from school',
        'Review report card',
        'Attend PTA meeting'
      ],
      principal: [
        'Review budget proposal',
        'Meet with school board',
        'Approve new curriculum'
      ],
      attender: [
        'Mark attendance for all classes',
        'Generate monthly report',
        'Update student records'
      ],
      admin: [
        'Backup system data',
        'Review user permissions',
        'Update software'
      ]
    };

    setReminders(roleReminders[role] || []);
  }, [role]);

  return (
    <div className="automated-reminders">
      <h4>Automated Reminders</h4>
      <ul>
        {reminders.map((reminder, index) => (
          <li key={index}>{reminder}</li>
        ))}
      </ul>
    </div>
  );
};

export default AutomatedReminders;
