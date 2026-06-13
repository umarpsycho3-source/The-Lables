require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const http = require('http');
const { Server } = require('socket.io');

// Import Mongoose Models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Import Cloudinary Setup
const { uploadCloud } = require('./config/cloudinary');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let onlineAdmins = new Set();
let activeChats = new Map();

io.on('connection', (socket) => {
  socket.on('admin_login', () => {
    onlineAdmins.add(socket.id);
    socket.join('admins');
    io.emit('admin_status', { online: onlineAdmins.size > 0 });
    
    // Send all active chats to the newly connected admin
    const chatsArray = Array.from(activeChats.values());
    socket.emit('all_active_chats', chatsArray);
  });

  socket.on('check_admin_status', () => {
    socket.emit('admin_status', { online: onlineAdmins.size > 0 });
  });

  socket.on('start_chat', (data) => {
    const newChat = { 
      id: socket.id, 
      name: data.name, 
      email: data.email, 
      messages: [] 
    };
    activeChats.set(socket.id, newChat);
    io.to('admins').emit('new_chat', newChat);
  });

  socket.on('user_message', (msg) => {
    const chat = activeChats.get(socket.id);
    if (chat) {
      const messageObj = { sender: 'user', text: msg, time: new Date() };
      chat.messages.push(messageObj);
      io.to('admins').emit('user_message', { socketId: socket.id, message: messageObj });
    }
  });

  socket.on('admin_message', (data) => {
    const chat = activeChats.get(data.targetSocketId);
    if (chat) {
      const messageObj = { sender: 'admin', text: data.msg, time: new Date() };
      chat.messages.push(messageObj);
      io.to(data.targetSocketId).emit('admin_reply', data.msg);
    }
  });

  socket.on('end_chat', () => {
    if (activeChats.has(socket.id)) {
      io.to('admins').emit('chat_ended', socket.id);
      activeChats.delete(socket.id);
    }
  });

  socket.on('disconnect', () => {
    if (onlineAdmins.has(socket.id)) {
      onlineAdmins.delete(socket.id);
      io.emit('admin_status', { online: onlineAdmins.size > 0 });
    }
    if (activeChats.has(socket.id)) {
      io.to('admins').emit('chat_ended', socket.id);
      activeChats.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'luxe_super_secret_key_123';

const path = require('path');

app.use(cors());
app.use(express.json());

// Serve old uploads so old products don't break
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Cloud'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

const otpStore = new Map();

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// =======================
// AUTH ROUTES
// =======================
app.use('/api/auth', apiLimiter);

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!email || !email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Only @gmail.com addresses are allowed for security' });
    }

    const cleanPhone = phone?.replace(/\s+/g, '').replace(/[-()]/g, '') || '';
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      role: 'customer' 
    });
    
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, SECRET_KEY);
    res.json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Check if hashed or plain (for old data)
    let isMatch = false;
    if (user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }
      
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Email not found' });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiry: Date.now() + 15 * 60 * 1000 });
    
    console.log(`[DEV ONLY] OTP for ${email} is ${otp}`);
    res.json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
  if (Date.now() > record.expiry) return res.status(400).json({ error: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
  
  res.json({ success: true, message: 'OTP verified' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const record = otpStore.get(email);
    if (!record || record.otp !== otp) return res.status(400).json({ error: 'Invalid or expired OTP' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    otpStore.delete(email);
    
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// PRODUCTS ROUTES
// =======================

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    // Map _id to string for frontend compatibility
    res.json(products.map(p => {
      const obj = p.toObject();
      obj._id = obj._id.toString();
      return obj;
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    
    const newProduct = new Product(req.body);
    await newProduct.save();
    
    const obj = newProduct.toObject();
    obj._id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    Object.assign(product, req.body);
    
    if (product.images && product.images.length > 0 && !product.image) {
      product.image = product.images[0];
    }
    
    await product.save();
    
    const obj = product.toObject();
    obj._id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products/:id/reviews', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Verify purchase
    const userOrders = await Order.find({ user: req.user.id });
    const hasPurchasedAndReceived = userOrders.some(order => 
      order.status === 'Delivered' && 
      order.items.some(item => item.productId === req.params.id)
    );

    if (!hasPurchasedAndReceived) {
      return res.status(403).json({ error: 'You can only review products you have purchased and received.' });
    }

    const newReview = { user: req.body.user, rating: req.body.rating, comment: req.body.text, date: new Date() };
    product.reviews.push(newReview);
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// ORDERS ROUTES
// =======================

// File Upload Endpoint using Cloudinary
app.post('/api/upload', verifyToken, uploadCloud.array('images', 10), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Cloudinary returns the full URL in `file.path`
    const fileUrls = req.files.map(file => file.path);
    
    res.json({ urls: fileUrls });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('user', 'name email');
    } else {
      orders = await Order.find({ user: req.user.id });
    }
    res.json(orders.map(o => {
      const obj = o.toObject();
      obj.id = obj._id.toString();
      obj.userId = obj.user._id ? obj.user._id.toString() : obj.user.toString();
      obj.date = obj.createdAt;
      return obj;
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { shippingDetails } = req.body;
    if (shippingDetails && shippingDetails.email) {
      if (!shippingDetails.email.toLowerCase().endsWith('@gmail.com')) {
        return res.status(400).json({ error: 'Only @gmail.com addresses are allowed for security' });
      }
    }
    if (shippingDetails && shippingDetails.phone) {
      const cleanPhone = shippingDetails.phone.replace(/\s+/g, '').replace(/[-()]/g, '');
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }
    }

    const mappedItems = req.body.items.map(item => ({
      ...item,
      productId: item.productId || item._id || item.id
    }));

    const newOrder = new Order({
      user: req.user.id,
      status: 'Processing',
      items: mappedItems,
      total: req.body.total,
      paymentMethod: req.body.paymentMethod || 'credit_card',
      referenceCode: req.body.referenceCode || null,
      shippingDetails: req.body.shippingDetails || null
    });
    
    await newOrder.save();
    
    const obj = newOrder.toObject();
    obj.id = obj._id.toString();
    obj.date = obj.createdAt;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/status', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    if (req.body.status === 'Cancelled') {
      const diffHours = Math.abs(new Date() - order.createdAt) / 36e5;
      if (diffHours > 24) return res.status(400).json({ error: 'Cancellation period expired' });
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    order.status = req.body.status;
    await order.save();
    
    // Add notification for the user
    if (req.user.role === 'admin') {
      const user = await User.findById(order.user);
      if (user) {
        user.notifications.unshift({
          message: `Your order ${order._id} status was updated to: ${req.body.status}`,
          date: new Date(),
          read: false
        });
        await user.save();
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/notifications', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user?.notifications || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notifications/read', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.notifications) {
      user.notifications.forEach(n => n.read = true);
      await user.save();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/items/:itemIndex/cancel', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    const diffHours = Math.abs(new Date() - order.createdAt) / 36e5;
    if (diffHours > 24) return res.status(400).json({ error: 'Cancellation period expired' });

    const itemIndex = parseInt(req.params.itemIndex);
    if (!order.items[itemIndex]) return res.status(404).json({ error: 'Item not found' });
    
    if (order.items[itemIndex].status === 'Cancelled') {
      return res.status(400).json({ error: 'Item is already cancelled' });
    }

    order.items[itemIndex].status = 'Cancelled';
    
    const newTotal = order.items.reduce((sum, item) => {
      if (item.status !== 'Cancelled') {
        return sum + (item.price * item.quantity);
      }
      return sum;
    }, 0);
    
    order.total = newTotal;

    const allCancelled = order.items.every(item => item.status === 'Cancelled');
    if (allCancelled) {
      order.status = 'Cancelled';
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Contact API ---
const Inquiry = require('./models/Inquiry');

app.get('/api/inquiries', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const inquiries = await Inquiry.find({});
    res.json(inquiries.map(i => ({...i.toObject(), id: i._id.toString()})));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const newInquiry = new Inquiry({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });

    await newInquiry.save();
    res.status(201).json({ success: true, message: 'Inquiry saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
