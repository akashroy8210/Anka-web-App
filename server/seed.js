const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const SurpriseCategory = require('./models/SurpriseCategory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anka';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear only User and SurpriseCategory collections to preserve live instances/demos/coupons
    await User.deleteMany({});
    await SurpriseCategory.deleteMany({});
    console.log('Cleared User and SurpriseCategory collections.');

    // 1. Seed Admin User
    const adminUser = new User({
      username: 'admin',
      password: 'adminpassword123'
    });
    await adminUser.save();
    console.log('Seeded Super-Admin credentials: username: admin, password: adminpassword123');

    // 2. Seed Occasions (Surprise Categories)
    const occasions = [
      {
        name: "Virtual Date Surprise",
        slug: "virtual-date",
        description: "Pyaar ka izhaar aur pyaari yaadein custom timelines aur rose petals animations ke sath.",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['Personalized countdown timer', 'Upload up to 5 photographs', 'Background loops picker', 'Responsive mobile layout'], limits: { reasonsLimit: 6, timelineLimit: 3, photosLimit: 3, starsLimit: 5, dreamsLimit: 3, hasVoiceNotes: false } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Unlimited photo uploads', 'Interactive love letter Vibe', 'Voice note greetings', 'Custom lock screens', 'Virtual flower bouquets'], limits: { reasonsLimit: 999, timelineLimit: 10, photosLimit: 10, starsLimit: 999, dreamsLimit: 999, hasVoiceNotes: true } }
        ]
      },
      {
        name: "Valentine's Week Surprise",
        slug: "valentine",
        description: "Ek poora hafta pyaar ka! Rose Day se lekar Valentine's Day tak interactive surprise cards.",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['Personalized countdown timer', 'Upload up to 5 photographs', 'Background loops picker', 'Responsive mobile layout'], limits: { memoriesLimit: 3, photosLimit: 3 } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Unlimited photo uploads', 'Interactive love letter Vibe', 'Voice note greetings', 'Custom lock screens', 'Virtual flower bouquets'], limits: { memoriesLimit: 999, photosLimit: 999 } }
        ]
      },
      {
        name: "Birthday Surprise",
        slug: "birthday",
        description: "Digital confetti shower aur wish board se unka janamdin khas banayein.",
        imageUrl: "https://images.unsplash.com/photo-1464349172961-104d33a55191?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['Personalized countdown timer', 'Upload up to 5 photographs', 'Background loops picker', 'Responsive mobile layout'], limits: { memoriesLimit: 3, photosLimit: 3, hasLockSettings: false, hasLiveControl: false } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Unlimited photo uploads', 'Confetti shower greetings', 'Voice note wishes', 'Wishes board bulletin', 'Lock screens', 'Virtual flower bouquets'], limits: { memoriesLimit: 10, photosLimit: 12, hasLockSettings: true, hasLiveControl: true } }
        ]
      },
      {
        name: "Wedding Invitation",
        slug: "wedding-invitation",
        description: "Shadi ke shubh avsar par digital card, maps aur RSVP guest logs.",
        imageUrl: "https://res.cloudinary.com/db7iiwwg3/image/upload/v1783158865/Screenshot_2026-07-04_150144_rp95pj.png",
        tiers: [
          { name: 'Basic', price: 2500, inclusions: ['Single Page responsive invitation', 'RSVP via WhatsApp integration', 'Countdown wedding timer', 'Google Location maps embedding'], limits: { memoriesLimit: 3, photosLimit: 3 } },
          { name: 'Premium', price: 4000, inclusions: ['All in Basic', 'Interactive Photo Gallery Albums', 'Auto-play Background Music player', 'Custom RSVP dashboard for guests', 'Gift registry sections'], limits: { memoriesLimit: 999, photosLimit: 999 } }
        ]
      },
      {
        name: "Wedding Surprise (for a friend)",
        slug: "wedding-surprise",
        description: "Doston ka tohfa, pre-wedding scrapbooks aur group wishes.",
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['Countdown timeline', 'Upload up to 5 photos', 'Standard pre-wedding message'], limits: { memoriesLimit: 3, photosLimit: 3 } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Interactive digital scrapbook', 'Group wishes board', 'Personalized dynamic nicknames', 'Custom background tunes'], limits: { memoriesLimit: 999, photosLimit: 999 } }
        ]
      },
      {
        name: "New Year Surprise",
        slug: "new-year",
        description: "New Year resolutions aur countdown firework launcher animations.",
        imageUrl: "https://images.unsplash.com/photo-1546733749-6f17d79b9b5f?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['Countdown midnight timer', 'New Year resolution logs', 'Responsive layout'], limits: { memoriesLimit: 3, photosLimit: 3 } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Firework launcher interactive screens', 'Resolution progress boards', 'Audio loops player'], limits: { memoriesLimit: 999, photosLimit: 999 } }
        ]
      },
      {
        name: "Best Friend Surprise",
        slug: "best-friend",
        description: "BFF Scorecards, funny inside jokes aur custom memory frames.",
        imageUrl: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['BFF scorecard card', 'Upload up to 5 funny frames'], limits: { memoriesLimit: 3, photosLimit: 3 } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Inside jokes interactive boards', 'Custom friendship memories board', 'Bespoke music pickers'], limits: { memoriesLimit: 999, photosLimit: 999 } }
        ]
      },
      {
        name: "Friendship Day Surprise",
        slug: "friendship-day",
        description: "Friendship band animations aur custom cards poore gang ke liye.",
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['Friendship day card', 'Countdown band', 'Up to 5 images'], limits: { memoriesLimit: 3, photosLimit: 3 } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Interactive friendship band animations', 'Wishes bulletin boards', 'Custom gang wallpapers'], limits: { memoriesLimit: 999, photosLimit: 999 } }
        ]
      },
      {
        name: "Random Day Surprise",
        slug: "random-day",
        description: "Bina kisi wajah ke unhe batayein ki wo aapke liye kitne khas hain.",
        imageUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0962a95d?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['Custom countdown timer', 'Love note letters', 'Standard background sound'], limits: { memoriesLimit: 3, photosLimit: 3 } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Polaroids interactive slideshows', 'Bespoke letter templates', 'Flower bouquet unlocks'], limits: { memoriesLimit: 999, photosLimit: 999 } }
        ]
      },
      {
        name: "Proposal Surprise",
        slug: "proposal",
        description: "An emotional interactive love story building up to the most beautiful question.",
        imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600",
        tiers: [
          { name: 'Basic', price: 299, inclusions: ['Countdown timeline', 'Meet the star intro card', 'Interactive memory sky stars', 'Will you be mine final prompt'], limits: { favoritesLimit: 6, timelineLimit: 3, reasonsLimit: 6, starsLimit: 5, hasFutureDreams: false, hasLiveControl: false } },
          { name: 'Premium', price: 999, inclusions: ['Everything in Basic', 'Unlimited timeline milestones', 'Handwritten letter envelopes', 'Live control dashboards', 'Celebration firework controls'], limits: { favoritesLimit: 999, timelineLimit: 10, reasonsLimit: 999, starsLimit: 999, hasFutureDreams: true, hasLiveControl: true } }
        ]
      }
    ];

    const seededCategories = await SurpriseCategory.insertMany(occasions);
    console.log(`Seeded ${seededCategories.length} Surprise Categories.`);

    console.log('Database category seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
