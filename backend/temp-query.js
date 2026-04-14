require('dotenv').config({path: __dirname + '/.env'});
const connectDB = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const mongoose = require('mongoose');

connectDB().then(async () => {
  console.log('MongoDB Connected');
  
  // Count posts and users
  const postCount = await Post.countDocuments();
  console.log(`Total posts: ${postCount}`);
  
  const samplePost = await Post.findOne().populate('author', 'name email').lean();
  console.log('Sample post:', JSON.stringify(samplePost, null, 2));
  
  if (samplePost) {
    console.log('Author populated:', samplePost.author ? `${samplePost.author.name} (${samplePost.author.email})` : 'NO AUTHOR');
  } else {
    console.log('No posts found');
  }
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
