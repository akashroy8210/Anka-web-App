const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const SurpriseCategory = require('./models/SurpriseCategory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anka';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');    

    console.log('Database category seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
