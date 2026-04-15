const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const Comment = require('../models/Comment');
const { memberOrAdmin, postOwnerOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');
const router = express.Router();

// Minimal validation (no required/min length for title/body)
const validatePost = [
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(e => e.msg).join(', ');
      return res.status(400).json({ message: errorMessages });
    }
    next();
  }
];

// GET /api/posts — Public: all published posts (newest first), paginated, populate likes count
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .populate('likes', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Add commentCount to each post
    const postsWithCounts = await Promise.all(posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post.toObject(),
        commentCount
      };
    }));
    
    const total = await Post.countDocuments({ status: 'published' });
    res.json({ posts: postsWithCounts, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/posts/:id — Public: single post by ID (published only)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author editedBy', 'name profilePic')
      .populate('likes', 'name');
    if (!post || post.status !== 'published') return res.status(404).json({ message: 'Post not found' });
    const commentCount = await Comment.countDocuments({ post: req.params.id });
    res.json({ ...post.toObject(), commentCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts/:id/like — Toggle like (auth required)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.status !== 'published') return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const userLikedIndex = post.likes.indexOf(userId);
    
    if (userLikedIndex > -1) {
      // Unlike
      post.likes.splice(userLikedIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }
    
    await post.save();
    await post.populate('author', 'name profilePic');
    
    res.json({ likeCount: post.likes.length, liked: userLikedIndex === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/posts — Member or Admin: create new post (always published, no validation)
router.post('/', protect, memberOrAdmin, upload.single('image'), validatePost, async (req, res) => {
  try {
    const { title = '', body = '' } = req.body;
    const image = req.file ? `https://res.cloudinary.com/dgci0u1um/image/upload/${req.file.path}` : '';
    const post = await Post.create({ title, body, image, author: req.user._id, status: 'published' });

    await post.populate('author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/posts/:id — Edit: post owner or admin (no validation)
router.put('/:id', protect, memberOrAdmin, postOwnerOrAdmin, upload.single('image'), validatePost, async (req, res) => {
  try {
    const post = req.post; // From middleware
    const wasEdited = post.editedAt !== undefined;
    if (req.body.title !== undefined) post.title = req.body.title || '';
    if (req.body.body !== undefined) post.body = req.body.body || '';
    if (req.file) post.image = `https://res.cloudinary.com/dgci0u1um/image/upload/${req.file.path}`;
    else if (req.body.image === '') post.image = '';

    
    // Mark as edited if changed
    if (!wasEdited || req.body.title !== undefined || req.body.body !== undefined || req.file) {
      post.editedAt = new Date();
      post.editedBy = req.user._id;
    }
    
    await post.save();
    await post.populate('author editedBy', 'name profilePic');
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/posts/:id — Soft remove: post owner or admin
router.delete('/:id', protect, memberOrAdmin, postOwnerOrAdmin, async (req, res) => {
  try {
    const post = req.post; // From middleware
    post.status = 'removed';
    await post.save();
    res.json({ message: 'Post removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
