require('dotenv').config({path: __dirname + '/.env'});
const connectDB = require('./config/db');
const Post = require('./models/Post');
const User = require('./models/User');
const mongoose = require('mongoose');

connectDB().then(async () => {
  console.log('MongoDB Connected');
  
  // Use existing admin as author
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log('No admin found. Run seedAdmin.js first.');
    process.exit(1);
  }

  // Delete existing published posts
  await Post.deleteMany({ status: 'published' });
  console.log('Existing published posts deleted.');

  // Create 3 sample posts with valid Cloudinary images
  const samplePosts = [
    {
      title: 'Welcome to TheFolio',
      body: 'This is a sample published post. Test liking functionality here. Like with different accounts to verify counts persist.',
      image: 'https://res.cloudinary.com/dgci0u1um/image/upload/backend/public/static/media/jaja.d961b74eec12d919d301.jpg',
      author: admin._id,
      status: 'published'
    },
    {
      title: 'My First Blog Post',
      body: 'Getting started with React and Node.js fullstack development...',
      image: 'https://res.cloudinary.com/dgci0u1um/image/upload/backend/public/static/media/1.995f1aed9a1c001f632c.jpg',
      author: admin._id,
      status: 'published'
    },
    {
      title: 'Learning MongoDB',
      body: 'Experiences with Mongoose schemas, virtuals, population... likes array testing!',
      image: 'https://res.cloudinary.com/dgci0u1um/image/upload/backend/public/static/media/2.3fad43ea32e344a46459.jpg',
      author: admin._id,
      status: 'published'
    }
  ];

  for (let postData of samplePosts) {
    await Post.create(postData);
  }

  console.log('✅ 3 published posts seeded for testing likes!');
  console.log('Restart servers and test /home likes with User1 → logout → User2');
  process.exit(0);
}).catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
