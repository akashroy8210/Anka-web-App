const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Demo = require('./models/Demo');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anka';

// App-specific tier limits mapping per category
const APP_TIER_LIMITS = {
  'virtual-date': {
    basic: {
      photosLimit: 3,
      timelineLimit: 3,
      reasonsLimit: 6,
      dreamsLimit: 3,
      hasVoiceNotes: false,
      hasLiveControl: false
    },
    premium: {
      photosLimit: 15,
      timelineLimit: 10,
      reasonsLimit: 12,
      dreamsLimit: 6,
      hasVoiceNotes: true,
      hasLiveControl: true
    }
  },
  'birthday': {
    basic: {
      photosLimit: 3,
      timelineLimit: 3,
      reasonsLimit: 6,
      hasVoiceNotes: false,
      hasLiveControl: false
    },
    premium: {
      photosLimit: 15,
      timelineLimit: 10,
      reasonsLimit: 12,
      hasVoiceNotes: true,
      hasLiveControl: true
    }
  },
  'proposal': {
    basic: {
      photosLimit: 3,
      timelineLimit: 3,
      reasonsLimit: 6,
      starsLimit: 5,
      favoritesLimit: 6,
      hasFutureDreams: false,
      hasVoiceNotes: false,
      hasLiveControl: false
    },
    premium: {
      photosLimit: 15,
      timelineLimit: 10,
      reasonsLimit: 12,
      starsLimit: 15,
      favoritesLimit: 999,
      hasFutureDreams: true,
      hasVoiceNotes: true,
      hasLiveControl: true
    }
  }
};

const updateDatabaseTierLimits = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB to update app-specific tier limits...');

    const demos = await Demo.find({});
    let updatedCount = 0;

    for (const demo of demos) {
      const catSlug = String(demo.categorySlug || '').toLowerCase().trim();
      const appLimits = APP_TIER_LIMITS[catSlug] || APP_TIER_LIMITS['virtual-date'];

      let isModified = false;
      if (Array.isArray(demo.tiers)) {
        demo.tiers.forEach(tier => {
          const tierName = String(tier.name || '').toLowerCase().trim();
          if (tierName === 'basic') {
            tier.limits = { ...appLimits.basic, ...(tier.limits || {}) };
            isModified = true;
          } else if (tierName === 'premium') {
            tier.limits = { ...appLimits.premium, ...(tier.limits || {}) };
            isModified = true;
          }
        });
      }

      if (isModified) {
        demo.markModified('tiers');
        await demo.save();
        updatedCount++;
        console.log(`Updated app-specific limits for demo: ${demo.name} [Category: ${catSlug}]`);
      }
    }

    console.log(`Successfully updated tier limits for ${updatedCount} theme demos in database.`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating database tier limits:', err);
    process.exit(1);
  }
};

updateDatabaseTierLimits();
