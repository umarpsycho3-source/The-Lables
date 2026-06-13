require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const dbPath = path.join(__dirname, 'db.json');

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    const rawData = fs.readFileSync(dbPath);
    const dbJson = JSON.parse(rawData);

    console.log('Clearing old MongoDB data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // 1. Migrate Users
    console.log(`Migrating ${dbJson.users.length} users...`);
    const usersToInsert = dbJson.users.map(u => ({
      ...u,
      _id: undefined,
      oldId: u.id
    }));
    const insertedUsers = await User.insertMany(usersToInsert);

    const userMap = {};
    for (let i = 0; i < dbJson.users.length; i++) {
      userMap[dbJson.users[i].id] = insertedUsers[i]._id;
    }

    // 2. Migrate Products
    console.log(`Migrating ${dbJson.products.length} products...`);
    const productsToInsert = dbJson.products.map(p => {
      const prod = { ...p, _id: undefined, oldId: p._id };
      return prod;
    });
    const insertedProducts = await Product.insertMany(productsToInsert);

    const productMap = {};
    for (let i = 0; i < dbJson.products.length; i++) {
      productMap[dbJson.products[i]._id] = insertedProducts[i]._id;
    }

    // 3. Migrate Orders
    console.log(`Migrating ${dbJson.orders.length} orders...`);
    const ordersToInsert = dbJson.orders.map(o => {
      const newUserId = userMap[o.userId];
      
      const newItems = o.items.map(item => {
        const prodId = item.productId || item._id || item.id;
        return {
          productId: productMap[prodId] ? productMap[prodId].toString() : prodId.toString(),
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          size: item.size
        };
      });

      return {
        user: newUserId || insertedUsers[0]._id,
        status: o.status,
        total: o.total,
        paymentMethod: o.paymentMethod,
        referenceCode: o.referenceCode,
        shippingDetails: o.shippingDetails,
        items: newItems,
        createdAt: o.date ? new Date(o.date) : new Date()
      };
    });

    if (ordersToInsert.length > 0) {
      await Order.insertMany(ordersToInsert);
    }

    console.log('Migration complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
