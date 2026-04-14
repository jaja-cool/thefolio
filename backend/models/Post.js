const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  image: { type: String, default: '' }, // filename stored in uploads/
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['published', 'removed'], default: 'published' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked
  commentCount: { type: Number, default: 0 },
  editedAt: Date,
  editedBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }
}, { timestamps: true });

postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

module.exports = mongoose.model('Post', postSchema);
