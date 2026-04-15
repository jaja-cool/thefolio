require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

connectDB().then(async () => {
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.name || mongoose.connection.host}`);
  
  // 1. List all users
  const users = await User.find({}).select('name email role status password createdAt');
  console.log('\n📋 ALL USERS:');
  users.forEach((user, i) => {
    console.log(`${i+1}. ${user.email} (${user.role}) - Status: ${user.status || 'active'} - Created: ${user.createdAt}`);
  });
  
  // 2. Check admin specifically
  const admin = await User.findOne({ email: 'admin@folio.com' });
  if (!admin) {
    console.log('\n❌ NO ADMIN USER FOUND! Run: node seedAdmin.js');
    process.exit(1);
  }
  console.log(`\n✅ Admin found: ${admin.name} (${admin.role})`);
  
  // 3. Test password match
  const password = 'Admin1234';
  const isValid = await admin.matchPassword(password);
  console.log(`🔑 Password "${password}" ${isValid ? '✅ MATCHES' : '❌ FAILS'}`);
  
  if (admin.status !== 'active') {
    console.log('⚠️  Status is "' + admin.status + '" (should be "active" or null)');
  }
  
  console.log('\n🎉 DIAGNOSIS COMPLETE');
  process.exit(0);
}).catch(err => {
  console.error('💥 DB Error:', err.message);
  process.exit(1);
});

