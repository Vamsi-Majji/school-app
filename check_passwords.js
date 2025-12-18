const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const usersPath = path.join(__dirname, 'backend/data/users.json');

// Password mapping from proper_hash.js
const passwordMap = {
  'admin@sample.com': 'admin1pass',
  'student@sample.com': 'student2pass',
  'teacher@sample.com': 'teacher3pass',
  'parent@sample.com': 'parent4pass',
  'principal@sample.com': 'principal5pass',
  'attender@sample.com': 'attender6pass',
  'vamsimajji143@gmail.com': 'admin7pass',
  'student2@sample.com': 'student8pass',
  'teacher2@sample.com': 'teacher9pass',
  'parent2@sample.com': 'parent10pass',
  'student3@sample.com': 'student11pass',
  'teacher3@sample.com': 'teacher12pass',
  'attender2@sample.com': 'attender13pass',
  'principal2@sample.com': 'principal14pass',
  'admin2@sample.com': 'admin15pass',
  'accountant1@sample.com': 'accountant16pass',
  'accountant2@sample.com': 'accountant17pass',
  'professor@sample.com': 'professor18pass',
  'dean@sample.com': 'dean19pass',
  'hod@sample.com': 'hod20pass',
  'librarian@sample.com': 'librarian21pass',
  'student_new@example.com': 'student22pass',
  'parent_new@example.com': 'parent23pass',
  'teacher_new@example.com': 'teacher24pass',
  'attender_new@example.com': 'attender25pass',
  'kesav123@gmail.com': 'student26pass',
  'dharam raju': 'parent27pass'
};

async function checkPasswords() {
  try {
    const data = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(data);

    console.log('Checking password hashes...\n');

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const expectedPassword = passwordMap[user.email];

      if (expectedPassword) {
        const isValid = await bcrypt.compare(expectedPassword, user.password);
        if (isValid) {
          console.log(`✅ ${user.email}: Password matches`);
        } else {
          console.log(`❌ ${user.email}: Password does NOT match`);
        }
      } else {
        console.log(`⚠️  ${user.email}: No expected password found`);
      }
    }
  } catch (error) {
    console.error('Error checking passwords:', error);
  }
}

checkPasswords();
