const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const usersPath = path.join(__dirname, 'data/users.json');

// Test credentials from test_login.js
const testCredentials = [
  { username: 'admin@sample.com', password: 'admin1pass' },
  { username: 'student@sample.com', password: 'student2pass' },
  { username: 'teacher@sample.com', password: 'teacher3pass' }
];

async function testAuthLocally() {
  try {
    console.log('Testing authentication logic locally...\n');

    const data = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(data);

    for (const cred of testCredentials) {
      const user = users.find(u => u.username === cred.username || u.email === cred.username);

      if (!user) {
        console.log(`❌ User ${cred.username} not found`);
        continue;
      }

      // Test password verification (same logic as in auth.js)
      let isValidPassword = false;
      if (user.password.startsWith('$2a$')) {
        isValidPassword = await bcrypt.compare(cred.password, user.password);
      } else if (user.password.startsWith('$2a$10$')) {
        const crypto = require('crypto');
        const expectedHash = crypto.createHash('sha256').update(cred.password).digest('hex').substring(0, 32);
        isValidPassword = user.password.includes(expectedHash);
      } else {
        isValidPassword = cred.password === user.password;
      }

      if (!isValidPassword) {
        console.log(`❌ Password invalid for ${cred.username}`);
        continue;
      }

      // Test approval logic (same logic as in auth.js)
      const isApproved = user.approved === true || user.status === 'approved';
      if (user.role !== 'admin' && !isApproved) {
        console.log(`❌ User ${cred.username} not approved (status: ${user.status}, approved: ${user.approved})`);
        continue;
      }

      console.log(`✅ ${cred.username} authentication successful!`);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAuthLocally();
