const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const SurpriseCategory = require('./models/SurpriseCategory');
const Demo = require('./models/Demo');
const Coupon = require('./models/Coupon');
const OnDemandLead = require('./models/OnDemandLead');
const SurpriseInstance = require('./models/SurpriseInstance');
const Rating = require('./models/Rating');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anka';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await SurpriseCategory.deleteMany({});
    await Demo.deleteMany({});
    await Coupon.deleteMany({});
    await OnDemandLead.deleteMany({});
    await SurpriseInstance.deleteMany({});
    await Rating.deleteMany({});
    console.log('Cleared all collections.');

    // 1. Seed Admin User
    const adminUser = new User({
      username: 'admin',
      password: 'adminpassword123'
    });
    await adminUser.save();
    console.log('Seeded Super-Admin credentials: username: admin, password: adminpassword123');

    // 2. Seed Occasions (Surprise Categories)
    const occasions = [
      { name: "Valentine's Day Surprise", slug: "valentines", description: "Pyaar ka izhaar aur pyaari yaadein custom timelines aur rose petals animations ke sath.", imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600" },
      { name: "Birthday Surprise", slug: "birthday", description: "Digital confetti shower aur wish board se unka janamdin khas banayein.", imageUrl: "https://images.unsplash.com/photo-1464349172961-104d33a55191?auto=format&fit=crop&q=80&w=600" },
      { name: "Wedding Invitation", slug: "wedding-invitation", description: "Shadi ke shubh avsar par digital card, maps aur RSVP guest logs.", imageUrl: "https://res.cloudinary.com/db7iiwwg3/image/upload/v1783158865/Screenshot_2026-07-04_150144_rp95pj.png" },
      { name: "Wedding Surprise (for a friend)", slug: "wedding-surprise", description: "Doston ka tohfa, pre-wedding scrapbooks aur group wishes.", imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600" },
      { name: "New Year Surprise", slug: "new-year", description: "New Year resolutions aur countdown firework launcher animations.", imageUrl: "https://images.unsplash.com/photo-1546733749-6f17d79b9b5f?auto=format&fit=crop&q=80&w=600" },
      { name: "Best Friend Surprise", slug: "best-friend", description: "BFF Scorecards, funny inside jokes aur custom memory frames.", imageUrl: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600" },
      { name: "Friendship Day Surprise", slug: "friendship-day", description: "Friendship band animations aur custom cards poore gang ke liye.", imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600" },
      { name: "Random Day Surprise", slug: "random-day", description: "Bina kisi wajah ke unhe batayein ki wo aapke liye kitne khas hain.", imageUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0962a95d?auto=format&fit=crop&q=80&w=600" }
    ];

    const seededCategories = await SurpriseCategory.insertMany(occasions);
    console.log(`Seeded ${seededCategories.length} Surprise Categories.`);

    // Map by slug
    const catMap = {};
    seededCategories.forEach(c => {
      catMap[c.slug] = c._id;
    });

    // 3. Seed Demos linked to categories
    const demosList = [
      // Valentine's Day Demos
      {
        categoryId: catMap['valentines'],
        name: "Classic Pink Romance",
        videoUrl: "https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Screenrecording_20260703_134249_zwsfis.mp4",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprise-fawn-gamma.vercel.app/",
        price: 99,
        themeSlug: "classic",
        ratingAverage: 4.8,
        ratingCount: 15
      },
      {
        categoryId: catMap['valentines'],
        name: "Modern Dark Rose Vibe",
        videoUrl: "https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Screenrecording_20260703_134249_zwsfis.mp4",
        imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprise-fawn-gamma.vercel.app/",
        price: 99,
        themeSlug: "dark-rose",
        ratingAverage: 4.6,
        ratingCount: 8
      },

      // Birthday Demos
      {
        categoryId: catMap['birthday'],
        name: "Vibrant Pastel Birthday",
        videoUrl: "https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Screenrecording_20260703_134249_zwsfis.mp4",
        imageUrl: "https://images.unsplash.com/photo-1464349172961-104d33a55191?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprisebabe.vercel.app/",
        price: 99,
        themeSlug: "pastel",
        ratingAverage: 4.9,
        ratingCount: 22
      },
      {
        categoryId: catMap['birthday'],
        name: "Golden Glow Celebration",
        videoUrl: "https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Screenrecording_20260703_134249_zwsfis.mp4",
        imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprisebabe.vercel.app/",
        price: 99,
        themeSlug: "golden",
        ratingAverage: 4.7,
        ratingCount: 14
      },

      // Wedding Invitation Demos (Basic ₹2,500 / Premium ₹4,000)
      {
        categoryId: catMap['wedding-invitation'],
        name: "Royal Gold Invitation (Basic)",
        videoUrl: "https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Screenrecording_20260703_134249_zwsfis.mp4",
        imageUrl: "https://res.cloudinary.com/db7iiwwg3/image/upload/v1783158865/Screenshot_2026-07-04_150144_rp95pj.png",
        liveDemoUrl: "https://wedding-website-lime-beta.vercel.app/",
        price: 2500,
        themeSlug: "royal-gold",
        ratingAverage: 4.8,
        ratingCount: 31
      },
      {
        categoryId: catMap['wedding-invitation'],
        name: "Elegance Minimalist (Premium)",
        videoUrl: "https://res.cloudinary.com/db7iiwwg3/video/upload/v1783067139/Screenrecording_20260703_134249_zwsfis.mp4",
        imageUrl: "https://res.cloudinary.com/db7iiwwg3/image/upload/v1783158865/Screenshot_2026-07-04_150144_rp95pj.png",
        liveDemoUrl: "https://wedding-website-lime-beta.vercel.app/",
        price: 4000,
        themeSlug: "minimalist",
        ratingAverage: 4.9,
        ratingCount: 45
      },

      // Wedding Surprise Demos
      {
        categoryId: catMap['wedding-surprise'],
        name: "Cozy Scrapbook Friend Gift",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprisebabe.vercel.app/",
        price: 99,
        themeSlug: "cozy",
        ratingAverage: 4.7,
        ratingCount: 12
      },

      // New Year Demos
      {
        categoryId: catMap['new-year'],
        name: "Sparkling Firework Capsule",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        imageUrl: "https://images.unsplash.com/photo-1546733749-6f17d79b9b5f?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprisebabe.vercel.app/",
        price: 99,
        themeSlug: "sparkling",
        ratingAverage: 4.5,
        ratingCount: 9
      },

      // Best Friend Demos
      {
        categoryId: catMap['best-friend'],
        name: "Quirky Friendship Meme Theme",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        imageUrl: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprisebabe.vercel.app/",
        price: 99,
        themeSlug: "meme",
        ratingAverage: 4.8,
        ratingCount: 19
      },

      // Friendship Day Demos
      {
        categoryId: catMap['friendship-day'],
        name: "Neon Gang Friendship Hub",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprisebabe.vercel.app/",
        price: 99,
        themeSlug: "neon",
        ratingAverage: 4.7,
        ratingCount: 15
      },

      // Random Day Demos
      {
        categoryId: catMap['random-day'],
        name: "Spontaneous Pastel Polaroids",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        imageUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0962a95d?auto=format&fit=crop&q=80&w=600",
        liveDemoUrl: "https://surprisebabe.vercel.app/",
        price: 99,
        themeSlug: "pastel-polaroid",
        ratingAverage: 4.9,
        ratingCount: 26
      }
    ];

    const seededDemos = await Demo.insertMany(demosList);
    console.log(`Seeded ${seededDemos.length} Surprise Demo design themes.`);

    // 4. Seed Coupons
    const coupons = [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'ANKA50',
        discountType: 'fixed',
        discountValue: 50,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];

    await Coupon.insertMany(coupons);
    console.log('Seeded default coupons.');

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
