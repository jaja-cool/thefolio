require('dotenv').config({path: __dirname + '/.env'});
const connectDB = require('./config/db');
const User = require('./models/User');
const mongoose = require('mongoose');

connectDB().then(async () => {
  console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  await User.deleteOne({ email: 'admin@folio.com' });
  console.log('Old admin@folio.com deleted if existed.');
  
  const exists = await User.findOne({ email: 'admin@folio.com' });
  if (exists) {
    console.log('Admin still exists after delete.');
    process.exit();
  }

  await User.create({
    name: 'TheFolio Admin',
    email: 'admin@folio.com',
    password: 'Admin1234',
    role: 'admin',
  });

  console.log('Admin account created successfully!');
  console.log('Email: admin@folio.com');
  console.log('Password: Admin1234');
  process.exit();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
