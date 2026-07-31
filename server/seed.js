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

const THEMES_TO_SEED = [
  {
    name: "Girlfriend's Day — Dark Luxury",
    themeSlug: "girlfriend-day-dark",
    categorySlug: "girlfriends",
    description: "Netflix × Apple Dark Luxury theme with gold accents, glassmorphism, and dark aesthetics",
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-looking-at-a-lake-41584-large.mp4",
    liveDemoUrl: "/demo/girlfriend-day-dark"
  },
  {
    name: "Girlfriend's Day — Baby Pink & Lavender",
    themeSlug: "girlfriend-day-pastel",
    categorySlug: "girlfriends",
    description: "Cute, warm, elegant theme with baby pink, brown, and lavender scrapbook aesthetics",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-looking-at-a-lake-41584-large.mp4",
    liveDemoUrl: "/demo/girlfriend-day-pastel"
  },
  {
    name: "Girlfriend's Day — Soft Pink",
    themeSlug: "girlfriend-day-pink",
    categorySlug: "girlfriends",
    description: "Dreamy, feminine, floating hearts with minimal luxury design and soft rounded cards",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-looking-at-a-lake-41584-large.mp4",
    liveDemoUrl: "/demo/girlfriend-day-pink"
  }
];

const seedGirlfriendThemes = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for Girlfriend\'s Day database seeding...');

    // 1. Create or update SurpriseCategory for girlfriends
    let category = await SurpriseCategory.findOne({ slug: 'girlfriends' });
    if (!category) {
      category = await SurpriseCategory.create({
        name: "Girlfriend's Day",
        slug: "girlfriends",
        description: "An emotional interactive journey for Girlfriend's Day featuring 10 acts, 20 quiz questions, dual-page scrapbook memory book, and love letter.",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
        demoVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-looking-at-a-lake-41584-large.mp4",
        liveDemoUrl: "/demo/girlfriend-day-dark",
        isActive: true
      });
      console.log(`Created new category: ${category.name} (${category.slug})`);
    } else {
      console.log(`Found existing category: ${category.name} (${category.slug})`);
    }

    // 2. Seed all 3 themes as Premium-only Demos
    for (const themeItem of THEMES_TO_SEED) {
      let demo = await Demo.findOne({ themeSlug: themeItem.themeSlug });

      const premiumTier = {
        name: 'Premium',
        price: 999,
        inclusions: [
          'All 10 Interactive Acts',
          '20 Love Quiz Questions',
          '5 Chapter Scrapbook Memory Book',
          'Web Speech TTS Narration',
          'Boyfriend Live Control Panel',
          'Real-time Flying Kisses & Wish Sync'
        ],
        limits: GIRLFRIEND_TIER_LIMITS
      };

      if (!demo) {
        demo = await Demo.create({
          categoryId: category._id,
          name: themeItem.name,
          categorySlug: themeItem.categorySlug,
          themeSlug: themeItem.themeSlug,
          description: themeItem.description,
          imageUrl: themeItem.imageUrl,
          videoUrl: themeItem.videoUrl,
          liveDemoUrl: themeItem.liveDemoUrl,
          tiers: [premiumTier]
        });
        console.log(`Created new Girlfriend's Day theme demo: ${demo.name} [slug: ${demo.themeSlug}]`);
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
        console.log(`Updated existing Girlfriend's Day theme demo: ${demo.name} [slug: ${demo.themeSlug}]`);
      }
    }

    console.log('Successfully seeded all Girlfriend\'s Day themes in database!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Girlfriend\'s Day themes in database:', err);
    process.exit(1);
  }
};

seedGirlfriendThemes();
