const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  images: [{ type: String }],
  color: { type: String },
  description: { type: String },
  isOffer: { type: Boolean, default: false },
  offerPrice: { type: Number },
  isNewArrival: { type: Boolean, default: false },
  outOfStockSizes: [{ type: String }],
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
