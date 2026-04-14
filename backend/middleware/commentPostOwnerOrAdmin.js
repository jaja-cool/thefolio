const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Middleware: User is comment owner, post owner, or admin
const commentPostOwnerOrAdmin = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post', 'author');
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isCommentOwner = comment.author.toString() === req.user._id.toString();
    const isPostOwner = comment.post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCommentOwner && !isPostOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized for this comment' });
    }

    req.comment = comment;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = commentPostOwnerOrAdmin;
