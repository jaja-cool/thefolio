require('dotenv').config({path: __dirname + '/.env'});
const connectDB = require('./config/db');
const Post = require('./models/Post');

connectDB().then(async () => {
  console.log('MongoDB Connected');
  
  await Post.deleteMany({});
  console.log('✅ All posts deleted! Admin dashboard now empty for fresh posts.');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
