require('dns').setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://thelabel_db_user:UmarTaper1234@thelabel.arwtiy7.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=thelabel';

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully using ipv4first!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
