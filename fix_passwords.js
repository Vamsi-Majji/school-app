const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const usersPath = path.join(__dirname, 'backend/data/users.json');

// Simple hash function for demonstration (not secure for production)
function simpleHash(password) {
  return crypto.createHash('sha256').update(password).digest('hex').substring(0, 32);
}

async function fixPasswordsAndEmails() {
  try {
    const data = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(data);

    const usedEmails = new Set();
    const usedPasswords = new Set();

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // Ensure unique email
      let originalEmail = user.email;
      let emailCounter = 1;
      while (usedEmails.has(user.email)) {
        const emailParts = originalEmail.split('@');
        user.email = `${emailParts[0]}${emailCounter}@${emailParts[1]}`;
        emailCounter++;
      }
      usedEmails.add(user.email);

      // Update username to match email if it's an email
      if (user.username.includes('@')) {
        user.username = user.email;
      }

      // Generate unique password hash
      let password = `${user.role}123`; // Default password pattern
      if (user.role === 'student') {
        password = `student${i + 1}pass`;
      } else if (user.role === 'parent') {
        password = `parent${i + 1}pass`;
      } else {
        password = `${user.role}${i + 1}pass`;
      }

      // Ensure password uniqueness
      let passwordCounter = 1;
      let uniquePassword = password;
      while (usedPasswords.has(uniquePassword)) {
        uniquePassword = `${password}${passwordCounter}`;
        passwordCounter++;
      }
      usedPasswords.add(uniquePassword);

      // Create a mock bcrypt hash format
      user.password = `$2a$10$${simpleHash(uniquePassword)}`;

      console.log(`Updated user ${user.username}: email=${user.email}, password=${uniquePassword}`);
    }

    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
    console.log('All passwords and emails have been updated with unique values.');
  } catch (error) {
    console.error('Error fixing passwords and emails:', error);
  }
}

fixPasswordsAndEmails();
