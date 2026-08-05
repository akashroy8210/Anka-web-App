const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SurpriseCategory = require('./models/SurpriseCategory');
const Demo = require('./models/Demo');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anka';

const GIRLFRIEND_TIER_LIMITS = {
  photosLimit: 20,
  chaptersLimit: 5,
  questionsLimit: 20,
  hasVoiceNotes: true,
  hasLiveControl: true
};

const BIRTHDAY_TIER_LIMITS = {
  photosLimit: 20,
  timelineLimit: 10,
  hasVoiceNotes: true,
  hasLiveControl: true
};



const BIRTHDAY_THEMES = [
  {
    name: "Birthday Surprise — Midnight Luxury Gold",
    themeSlug: "birthday-dark",
    categorySlug: "birthday",
    description: "Midnight Slate & Gold Luxury theme with champagne glows, dark glassmorphism, and adult party aesthetics",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41585-large.mp4",
    liveDemoUrl: "/demo/birthday-dark"
  },
  {
    name: "Birthday Surprise — Baby Pink & Soft Pastel",
    themeSlug: "birthday-pastel",
    categorySlug: "birthday",
    description: "Cute, joyful pastel theme with baby pink, mint, lavender, and warm cocoa text",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41585-large.mp4",
    liveDemoUrl: "/demo/birthday-pastel"
  },
  {
    name: "Birthday Surprise — Hot Magenta & Velvet Pink",
    themeSlug: "birthday-pink",
    categorySlug: "birthday",
    description: "Vibrant hot magenta night theme with rose gold glows and velvet pink glass cards",
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41585-large.mp4",
    liveDemoUrl: "/demo/birthday-pink"
  }
];

const seedThemes = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for database seeding...');

    

    // 2. Birthday Surprise Category & Themes
    let bdayCategory = await SurpriseCategory.findOne({ slug: 'birthday' });
    if (!bdayCategory) {
      bdayCategory = await SurpriseCategory.create({
        name: "Birthday Surprise",
        slug: "birthday",
        description: "An emotional interactive birthday celebration featuring candle blowing, interactive cake cutting, gift unboxing, photo timeline, and typewriter love letter.",
        imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
        demoVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41585-large.mp4",
        liveDemoUrl: "/demo/birthday-dark",
        isActive: true
      });
      console.log(`Created new category: ${bdayCategory.name} (${bdayCategory.slug})`);
    }

    for (const themeItem of BIRTHDAY_THEMES) {
      let demo = await Demo.findOne({ themeSlug: themeItem.themeSlug });
      const premiumTier = {
        name: 'Premium',
        price: 999,
        inclusions: [
          'Passcode Security Unlock',
          'Interactive Candle Blowing & Song',
          'Drag Cake Cutting & Slicing Scene',
          'Virtual Gift Box Unboxing',
          'Typewriter Birthday Letter',
          'Photo Memory Timeline',
          'Live Control Command Center'
        ],
        limits: BIRTHDAY_TIER_LIMITS
      };

      if (!demo) {
        demo = await Demo.create({
          categoryId: bdayCategory._id,
          name: themeItem.name,
          categorySlug: themeItem.categorySlug,
          themeSlug: themeItem.themeSlug,
          description: themeItem.description,
          imageUrl: themeItem.imageUrl,
          videoUrl: themeItem.videoUrl,
          liveDemoUrl: themeItem.liveDemoUrl,
          tiers: [premiumTier]
        });
        console.log(`Created Birthday Surprise theme demo: ${demo.name} [slug: ${demo.themeSlug}]`);
      } else {
        demo.name = themeItem.name;
        demo.categorySlug = themeItem.categorySlug;
        demo.description = themeItem.description;
        demo.imageUrl = themeItem.imageUrl;
        demo.videoUrl = themeItem.videoUrl;
        demo.liveDemoUrl = themeItem.liveDemoUrl;
        demo.tiers = [premiumTier];
        demo.markModified('tiers');
        await demo.save();
        console.log(`Updated Birthday Surprise theme demo: ${demo.name} [slug: ${demo.themeSlug}]`);
      }
    }

    console.log('Successfully seeded all Birthday Surprise themes in database!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding themes in database:', err);
    process.exit(1);
  }
};

seedThemes();
