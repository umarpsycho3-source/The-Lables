const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const addProducts = async () => {
  await connectDB();

  try {
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No admin user found. Cannot add products.');
      process.exit(1);
    }

    const newProducts = [
      {
        user: adminUser._id,
        name: 'Arsenal 23/24 Home Player Version',
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
        brand: 'Arsenal',
        category: 'Arsenal',
        description: 'Authentic Arsenal home jersey for the 23/24 season.',
        price: 8500,
        countInStock: 20,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'White'],
        material: '100% Recycled Polyester',
        isNewArrival: true
      },
      {
        user: adminUser._id,
        name: 'FC Barcelona 23/24 Away Player Version',
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
        brand: 'Barcelona',
        category: 'Barcelona',
        description: 'Authentic FC Barcelona away jersey for the 23/24 season.',
        price: 8500,
        countInStock: 15,
        sizes: ['S', 'M', 'L'],
        colors: ['White', 'Blue', 'Red'],
        material: '100% Recycled Polyester',
        isNewArrival: false
      },
      {
        user: adminUser._id,
        name: 'Manchester United 23/24 Home Player Version',
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
        brand: 'Manchester United',
        category: 'Manchester United',
        description: 'Authentic Manchester United home jersey for the 23/24 season.',
        price: 9000,
        countInStock: 30,
        sizes: ['M', 'L', 'XL'],
        colors: ['Red', 'Black'],
        material: '100% Recycled Polyester',
        isNewArrival: true
      },
      {
        user: adminUser._id,
        name: 'Bayern Munich 23/24 Home Player Version',
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
        brand: 'Bayern Munich',
        category: 'Bayern Munich',
        description: 'Authentic Bayern Munich home jersey for the 23/24 season.',
        price: 8500,
        countInStock: 25,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'White'],
        material: '100% Recycled Polyester',
        isNewArrival: false
      }
    ];

    await Product.insertMany(newProducts);
    console.log('4 new products added successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

addProducts();
