// backend/middleware/role.middleware.js
// Only admins can pass
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied — Admins only' });
};

// Members or Admins can pass (but not guests/unauthenticated users)
const memberOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'member' || req.user.role === 'admin')) return next();
  return res.status(403).json({ message: 'Access denied — Members only' });
};

// Post owner or admin for own post operations
const postOwnerOrAdmin = async (req, res, next) => {
  try {
    const Post = require('../models/Post');
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized for this post' });
    req.post = post;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Comment owner or admin for own comment
const commentOwnerOrAdmin = async (req, res, next) => {
  try {
    const Comment = require('../models/Comment');
    const comment = await Comment.findById(req.params.id || req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized for this comment' });
    req.comment = comment;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { adminOnly, memberOrAdmin, postOwnerOrAdmin, commentOwnerOrAdmin };
