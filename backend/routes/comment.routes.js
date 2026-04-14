// backend/routes/comment.routes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const commentPostOwnerOrAdmin = require('../middleware/commentPostOwnerOrAdmin');
const commentOwnerOrAdmin = require('../middleware/commentOwnerOrAdmin');
const router = express.Router();

// Validation
const validateComment = [
  body('body').trim().notEmpty().escape().withMessage('Comment body required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() });
    next();
  }
];

// GET /api/comments/:postId — Public: comments for a post, paginated
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name profilePic')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
    const total = await Comment.countDocuments({ post: req.params.postId });
    res.json({ comments, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/comments/:postId — Member/Admin: add comment to post
router.post('/:postId', protect, memberOrAdmin, validateComment, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      body: req.body.body
    });
    
    // Increment post comment count
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentCount: 1 } });
    
    await comment.populate('author', 'name profilePic');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/comments/:id — Own comment or admin
router.delete('/:id', protect, memberOrAdmin, commentPostOwnerOrAdmin, async (req, res) => {
  try {
    const postId = req.comment.post;
    await req.comment.deleteOne();
    // Decrement post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/comments/:id — Comment owner or admin (post owner cannot edit)
router.put('/:id', protect, memberOrAdmin, commentOwnerOrAdmin, validateComment, async (req, res) => {
  try {
    req.comment.body = req.body.body;
    await req.comment.save();
    await req.comment.populate('author', 'name profilePic');
    res.json(req.comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
