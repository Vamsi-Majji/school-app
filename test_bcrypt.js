const bcrypt = require('bcryptjs');

async function testBcrypt() {
  const password = 'admin1pass';
  console.log('Original password:', password);

  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);
  console.log('Hash length:', hash.length);

  const isValid = await bcrypt.compare(password, hash);
  console.log('Password matches hash:', isValid);

  // Test with truncated hash
  const truncatedHash = hash.substring(0, 42); // 32 chars after $2a$10$
  console.log('Truncated hash:', truncatedHash);
  console.log('Truncated hash length:', truncatedHash.length);

  const isValidTruncated = await bcrypt.compare(password, truncatedHash);
  console.log('Password matches truncated hash:', isValidTruncated);
}

testBcrypt();
