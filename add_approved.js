const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, 'backend/data/users.json');

fs.readFile(usersPath, 'utf8', (err, data) => {
  if (err) throw err;
  const users = JSON.parse(data);
  const updatedUsers = users.map(user => ({ ...user, approved: true }));
  fs.writeFile(usersPath, JSON.stringify(updatedUsers, null, 2), (err) => {
    if (err) throw err;
    console.log('Updated users.json with approved: true');
  });
});
