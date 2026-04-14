// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' } // stores filename e.g. 'abc123.jpg' or URL
}, { timestamps: true });

// Index for efficient queries
// Indexes removed to fix duplicate index warning


// Pre-save hook: hash password before storing
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 12, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

// Instance method: compare entered password with stored hash
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
