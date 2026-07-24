const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const SurpriseCategory = require('./models/SurpriseCategory');
const Demo = require('./models/Demo');
const Coupon = require('./models/Coupon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anka';







const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Demo.deleteMany({});
    await SurpriseCategory.deleteMany({});
    // 1. Seed Categories if they don't exist
    const catMap = {};
    for (const occasion of occasions) {
      const newCategory=new SurpriseCategory(occasion);
      await newCategory.save();
      catMap[occasion.slug] = newCategory._id;
      console.log(`Seeded category: ${occasion.name} (${occasion.slug})`);
    }

    // 2. Seed Demos and fix their categoryIds
    for (const demo of demosList) {
      demo.categoryId = catMap[demo.categorySlug];
      const newDemo = new Demo(demo);
      await newDemo.save();
      console.log(`Seeded demo: ${demo.name} (${demo.categorySlug})`);
    }


    console.log('Database category and theme seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
