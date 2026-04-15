require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB().then(async () => {
  console.log('Connected. Deleting & recreating admin...');
  
  // Delete existing
  await User.deleteOne({ email: 'admin@folio.com' });
  console.log('Old admin deleted.');
  
  // Create fresh
  const admin = await User.create({
    name: 'TheFolio Admin',
    email: 'admin9@folio.com',
    password: 'Admin1234!',
    role: 'admin',
  });
  
  console.log('✅ NEW ADMIN CREATED!');
  console.log('Email:', admin.email);
  console.log('Password:', 'Admin1234');
  console.log('Role:', admin.role);
  
  // Test password
  const bcrypt = require('bcryptjs');
  const isValid = await bcrypt.compare('Admin1234', admin.password);
  console.log('Password test:', isValid ? '✅ OK' : '❌ FAIL');
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

