const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const addProducts = () => {
  try {
    const rawData = fs.readFileSync(dbPath);
    const db = JSON.parse(rawData);

    const newProducts = [
      {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        name: 'Arsenal 23/24 Home Player Version',
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
        category: 'Arsenal',
        price: 8500,
        description: 'Authentic Arsenal home jersey for the 23/24 season.',
        isOffer: false,
        isNewArrival: true,
        outOfStockSizes: []
      },
      {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        name: 'FC Barcelona 23/24 Away Player Version',
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
        category: 'Barcelona',
        price: 8500,
        description: 'Authentic FC Barcelona away jersey for the 23/24 season.',
        isOffer: false,
        isNewArrival: false,
        outOfStockSizes: ['S']
      },
      {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        name: 'Manchester United 23/24 Home Player Version',
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
        category: 'Manchester United',
        price: 9000,
        description: 'Authentic Manchester United home jersey for the 23/24 season.',
        isOffer: true,
        offerPrice: 7500,
        isNewArrival: true,
        outOfStockSizes: []
      },
      {
        _id: 'prod_' + Math.random().toString(36).substr(2, 9),
        name: 'Bayern Munich 23/24 Home Player Version',
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
        category: 'Bayern Munich',
        price: 8500,
        description: 'Authentic Bayern Munich home jersey for the 23/24 season.',
        isOffer: false,
        isNewArrival: false,
        outOfStockSizes: ['L', 'XL']
      }
    ];

    db.products.push(...newProducts);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('4 new products added successfully to db.json!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

addProducts();
