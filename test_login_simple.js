const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

async function testLogin() {
  try {
    // Read users
    const usersPath = path.join(__dirname, 'backend/data/users.json');
    const usersData = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(usersData);

    // Test admin login
    const username = 'admin@sample.com';
    const password = 'admin1pass';

    console.log('Testing login with:', { username, password });

    const user = users.find(user => user.username === username || user.email === username);
    console.log('Found user:', user ? { id: user.id, email: user.email, role: user.role, approved: user.approved, status: user.status } : 'No user found');

    if (!user) {
      console.log('User not found');
      return;
    }

    // Check password
    let isValidPassword = false;

    // Check if password is plain text
    if (user.password === password) {
      isValidPassword = true;
      console.log('Plain text password match');
    }
    // Check if password is bcrypt hash
    else if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
      try {
        isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Bcrypt compare result:', isValidPassword);
      } catch (error) {
        console.error('Bcrypt compare error:', error);
        isValidPassword = false;
      }
    }

    console.log('Password valid:', isValidPassword);

    // Check approval
    const isApproved = user.approved === true || user.status === 'approved';
    console.log('User approved:', isApproved);

    if (isValidPassword && (user.role === 'admin' || isApproved)) {
      console.log('Login successful!');
    } else {
      console.log('Login failed');
    }

  } catch (error) {
    console.error('Test error:', error);
  }
}

testLogin();
