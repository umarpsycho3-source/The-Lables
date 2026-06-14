const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  isApproved: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
