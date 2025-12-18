const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const usersPath = path.join(__dirname, 'backend/data/users.json');

async function hashPlainPasswords() {
  try {
    const data = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(data);

    for (let user of users) {
      // Check if password is plain text (not starting with $2a$)
      if (user.password && !user.password.startsWith('$2a$')) {
        console.log(`Hashing password for user ${user.username}: ${user.password}`);
        const hashed = await bcrypt.hash(user.password, 10);
        user.password = hashed;
        console.log(`New hash: ${hashed}`);
      }
    }

    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
    console.log('All plain text passwords have been hashed.');
  } catch (error) {
    console.error('Error hashing passwords:', error);
  }
}

hashPlainPasswords();
