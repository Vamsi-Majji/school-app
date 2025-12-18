import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings] = useState([
    { id: 1, title: 'Parent-Teacher Meeting', date: '2023-10-15', time: '10:00 AM' },
    { id: 2, title: 'School Event', date: '2023-10-20', time: '2:00 PM' }
  ]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getMeetingsForDate = (day) => {
    if (!day) return [];
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return meetings.filter(meeting => meeting.date === dateString);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: '#1976d2' }}>
        Calendar
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
          style={{ padding: '5px 10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
        >
          Prev
        </button>
        <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h5>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
          style={{ padding: '5px 10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
        >
          Next
        </button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{
            padding: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            fontSize: '0.8rem'
          }}>
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div key={index} style={{
            minHeight: '60px',
            padding: '4px',
            border: '1px solid #eee',
            backgroundColor: day ? 'white' : 'transparent',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {day && (
              <>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  position: 'absolute',
                  top: '2px',
                  left: '2px'
                }}>
                  {day}
                </span>
                <div style={{ marginTop: '20px' }}>
                  {getMeetingsForDate(day).map(meeting => (
                    <div key={meeting.id} style={{
                      fontSize: '0.7rem',
                      backgroundColor: '#e3f2fd',
                      padding: '2px 4px',
                      marginBottom: '2px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={`${meeting.title} at ${meeting.time}`}>
                      {meeting.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
