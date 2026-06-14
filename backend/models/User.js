const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'customer' },
  isVerifiedBuyer: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  profileImage: { type: String, default: '' },
  notifications: [{
    message: String,
    date: Date,
    read: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
