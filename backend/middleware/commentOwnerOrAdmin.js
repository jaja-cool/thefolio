const Comment = require('../models/Comment');

// Middleware: User is comment owner or admin (EXCLUDES post owner)
const commentOwnerOrAdmin = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post', 'author');
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isCommentOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCommentOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only comment owner or admin can edit this comment' });
    }

    req.comment = comment;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = commentOwnerOrAdmin;

