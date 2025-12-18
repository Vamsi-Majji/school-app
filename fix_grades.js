const fs = require('fs');
const path = require('path');

const gradesPath = path.join(__dirname, 'backend/data/grades.json');

// Read the corrupted file
let rawData = fs.readFileSync(gradesPath, 'utf8');

// Fix the corruption by removing the extra object at the end
rawData = rawData.replace(/}\s*$/, '}]');

// Parse and fix
let data = JSON.parse(rawData);

// Remove duplicate fields in the first entry
if (data[0] && data[0].studentId === 2 && data[0].subject === 'Math') {
  data[0] = {
    id: 1,
    studentId: 2,
    subject: 'Math',
    grade: 85,
    date: '2023-05-15',
    schoolName: 'Sample School'
  };
}

// Add schoolName to all entries
data.forEach(item => {
  if (!item.schoolName) {
    item.schoolName = 'Sample School';
  }
});

// Write back
fs.writeFileSync(gradesPath, JSON.stringify(data, null, 2));
console.log('Grades file fixed successfully');
