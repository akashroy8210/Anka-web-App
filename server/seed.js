const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SurpriseCategory = require('./models/SurpriseCategory');
const Demo = require('./models/Demo');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anka';



const seedThemes = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for database seeding...');

    // 3. Apology Surprise Category & 3 Themes (Midnight Romance, Blush Pink, Lavender Dream)
    let apologyCategory = await SurpriseCategory.findOne({ slug: 'apology' });
    if (!apologyCategory) {
      apologyCategory = await SurpriseCategory.create({
        name: "Apology Surprise",
        slug: "apology",
        description: "An interactive emotional apology experience for couples with scratch promises, cuteness meter overload, voice/video apology, and handwritten letter.",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
        demoVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41585-large.mp4",
        liveDemoUrl: "/demo/apology-midnight-romance",
        isActive: true
      });
      console.log(`Created new category: ${apologyCategory.name} (${apologyCategory.slug})`);
    }

    const APOLOGY_THEMES = [
      {
        name: "Apology Surprise — Midnight Romance",
        themeSlug: "apology-midnight-romance",
        categorySlug: "apology",
        description: "Dark, intimate velvet, candlelight and rose glow theme",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41585-large.mp4",
        liveDemoUrl: "/demo/apology-midnight-romance"
      },
      {
        name: "Apology Surprise — Blush Pink",
        themeSlug: "apology-blush-pink",
        categorySlug: "apology",
        description: "Soft warm pink paper stationery and spring petals theme",
        imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41585-large.mp4",
        liveDemoUrl: "/demo/apology-blush-pink"
      },
      {
        name: "Apology Surprise — Lavender Dream",
        themeSlug: "apology-lavender-dream",
        categorySlug: "apology",
        description: "Whimsical lilac, fireflies, stars and soft blue clouds theme",
        imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41585-large.mp4",
        liveDemoUrl: "/demo/apology-lavender-dream"
      }
    ];

    const apologyBasicTier = {
      name: 'Basic',
      price: 499,
      inclusions: [
        'Interactive Apology Journey',
        'Scratch-to-reveal Promises',
        'Photo Memories (Up to 5 Photos)',
        'Interactive Cuteness Meter',
        'Final Apology Letter'
      ],
      limits: { memories: 5, promises: 5, handwrittenNotes: 5, hasVoiceNotes: false, hasLiveControl: false }
    };

    const apologyPremiumTier = {
      name: 'Premium',
      price: 999,
      inclusions: [
        'Interactive Apology Journey',
        'Scratch-to-reveal Promises',
        'Photo Memories (Up to 15 Photos)',
        'Cuteness Meter Image Upload',
        'Voice Apology Recording',
        'Video Apology Message',
        'Live Control Command Center ⚡'
      ],
      limits: { memories: 15, promises: 10, handwrittenNotes: 10, hasVoiceNotes: true, hasLiveControl: true }
    };

    for (const themeItem of APOLOGY_THEMES) {
      let demo = await Demo.findOne({ themeSlug: themeItem.themeSlug });

      if (!demo) {
        demo = await Demo.create({
          categoryId: apologyCategory._id,
          name: themeItem.name,
          categorySlug: themeItem.categorySlug,
          themeSlug: themeItem.themeSlug,
          description: themeItem.description,
          imageUrl: themeItem.imageUrl,
          videoUrl: themeItem.videoUrl,
          liveDemoUrl: themeItem.liveDemoUrl,
          tiers: [apologyBasicTier, apologyPremiumTier]
        });
        console.log(`Created Apology Surprise theme demo: ${demo.name} [slug: ${demo.themeSlug}]`);
      } else {
        demo.name = themeItem.name;
        demo.categorySlug = themeItem.categorySlug;
        demo.description = themeItem.description;
        demo.imageUrl = themeItem.imageUrl;
        demo.videoUrl = themeItem.videoUrl;
        demo.liveDemoUrl = themeItem.liveDemoUrl;
        demo.tiers = [apologyBasicTier, apologyPremiumTier];
        demo.markModified('tiers');
        await demo.save();
        console.log(`Updated Apology Surprise theme demo: ${demo.name} [slug: ${demo.themeSlug}] with Basic & Premium tiers`);
      }
    }

    console.log('Successfully seeded all Apology Surprise themes in database!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding themes in database:', err);
    process.exit(1);
  }
};

seedThemes();
