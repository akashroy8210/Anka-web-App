const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const SurpriseCategory = require('./models/SurpriseCategory');
const Demo = require('./models/Demo');
const Coupon = require('./models/Coupon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anka';

const occasions = [
  {
    name: "Virtual Date Surprise",
    slug: "virtual-date",
    description: "A cozy digital space designed for long-distance couples with music, memory stars, mood garden, and live control surprises.",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800",
    liveDemoUrl: "/live/virtual-date/demo"
  },
  {
    name: "Birthday Celebration",
    slug: "birthday",
    description: "Interactive virtual birthday surprise with custom cake cutting, photo gallery, and birthday wishes.",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
    liveDemoUrl: "/live/birthday/demo"
  },
  {
    name: "Proposal Special",
    slug: "proposal",
    description: "Romantic proposal journey featuring love letter progression, memory sky, and final proposal ring reveal.",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800",
    liveDemoUrl: "/live/proposal/demo"
  }
];

const demosList = [
  {
    name: "Virtual Date Cozy Sanctuary",
    categorySlug: "virtual-date",
    themeSlug: "starry-night",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-sparkler-at-night-41582-large.mp4",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800",
    liveDemoUrl: "/live/virtual-date/demo",
    description: "Starry Night themed virtual date experience for couples.",
    tiers: [
      {
        name: "Basic",
        price: 399,
        features: [
          "Starry Night Theme",
          "Background Music Player",
          "Interactive Memory Timeline",
          "5 Stargazing Messages"
        ],
        inclusions: [
          "Starry Night Theme",
          "Background Music Player",
          "Interactive Memory Timeline",
          "5 Stargazing Messages"
        ]
      },
      {
        name: "Premium",
        price: 999,
        features: [
          "Everything in Basic",
          "Custom Audio & Voice Notes",
          "15 Stargazing Messages",
          "Real-time Live Control Panel"
        ],
        inclusions: [
          "Everything in Basic",
          "Custom Audio & Voice Notes",
          "15 Stargazing Messages",
          "Real-time Live Control Panel"
        ]
      }
    ]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Demo.deleteMany({});
    await SurpriseCategory.deleteMany({});

    // 1. Seed Categories using upsert
    const catMap = {};
    for (const occasion of occasions) {
      const categoryDoc = await SurpriseCategory.findOneAndUpdate(
        { slug: occasion.slug },
        occasion,
        { upsert: true, new: true, runValidators: true }
      );
      catMap[occasion.slug] = categoryDoc._id;
      console.log(`Seeded category: ${categoryDoc.name} (${categoryDoc.slug})`);
    }

    // 2. Seed Demos using upsert
    for (const demo of demosList) {
      demo.categoryId = catMap[demo.categorySlug];
      const demoDoc = await Demo.findOneAndUpdate(
        { categorySlug: demo.categorySlug, themeSlug: demo.themeSlug },
        demo,
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`Seeded demo: ${demoDoc.name} (${demoDoc.categorySlug})`);
    }

    console.log('Database category and theme seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
