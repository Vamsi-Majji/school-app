const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testLogin() {
  try {
    console.log('Testing login functionality...\n');

    // Test admin login
    const adminOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const adminResponse = await makeRequest(adminOptions, {
      username: 'admin@sample.com',
      password: 'admin1pass'
    });

    if (adminResponse.statusCode === 200) {
      console.log('✅ Admin login successful!');
      console.log('Token received:', adminResponse.data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Admin login failed:', adminResponse.data);
    }

    // Test student login
    const studentResponse = await makeRequest(adminOptions, {
      username: 'student@sample.com',
      password: 'student2pass'
    });

    if (studentResponse.statusCode === 200) {
      console.log('✅ Student login successful!');
      console.log('Token received:', studentResponse.data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Student login failed:', studentResponse.data);
    }

    // Test teacher login
    const teacherResponse = await makeRequest(adminOptions, {
      username: 'teacher@sample.com',
      password: 'teacher3pass'
    });

    if (teacherResponse.statusCode === 200) {
      console.log('✅ Teacher login successful!');
      console.log('Token received:', teacherResponse.data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Teacher login failed:', teacherResponse.data);
    }

    console.log('\n🎉 All login tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogin();
