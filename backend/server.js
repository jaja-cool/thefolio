// backend/server.js
require('dotenv').config(); // Load .env variables (local dev/backend/.env)
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
// Import routes (you will create these files in the next steps)
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const app = express();

connectDB(); // Connect to MongoDB

// ── Middleware ─────────────────────────────────────────────────
// Allow React (port 3000) to call this server
app.use(cors({ origin: ['http://localhost:3000', 'https://thefolio.vercel.app'], credentials: true }));
// Parse incoming JSON request bodies
app.use(express.json());
// Serve static frontend files at root
// e.g. http://localhost:5000/ → login.html
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded image files as public URLs
// e.g. http://localhost:5000/uploads/my-image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Remove SPA fallback - API only (frontend on Vercel/Netlify)


// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
