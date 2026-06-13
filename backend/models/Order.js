const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  status: { type: String, default: 'Processing' },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    size: { type: String },
    status: { type: String }
  }],
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'credit_card' },
  referenceCode: { type: String },
  shippingDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
