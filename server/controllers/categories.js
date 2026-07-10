const Demo = require('../models/Demo');
const SurpriseCategory = require('../models/SurpriseCategory');
const aiService = require('../services/ai');

// Get all surprise categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await SurpriseCategory.find().lean();
    for (const cat of categories) {
      cat.demos = await Demo.find({ categoryId: cat._id });
    }
    res.json({ success: true, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching categories.' });
  }
};

// Get single category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await SurpriseCategory.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    const demos = await Demo.find({ categoryId: category._id });
    res.json({ success: true, category, demos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching category.' });
  }
};

// Create a category (Admin only)
exports.createCategory = async (req, res) => {
  const { name, slug, description, demoVideoUrl, imageUrl, images, tiers, addons } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ success: false, message: 'Name and slug are required.' });
  }

  try {
    const existing = await SurpriseCategory.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category with this slug already exists.' });
    }

    const newCategory = new SurpriseCategory({
      name,
      slug,
      description,
      demoVideoUrl,
      imageUrl,
      images: images || [],
      tiers: tiers || [],
      addons: addons || []
    });

    await newCategory.save();
    res.status(201).json({ success: true, category: newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error creating category.' });
  }
};

// Update a category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const category = await SurpriseCategory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({ success: true, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating category.' });
  }
};

// Delete a category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await SurpriseCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting category.' });
  }
};

// Recipient/Admin: Generate AI memory description
exports.generateAIMemoryDescription = async (req, res) => {
  const { title, recipientName } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Memory title is required.' });
  }

  // 1. Try real Gemini generator
  const aiDesc = await aiService.generateMemoryDescription(title, recipientName);
  if (aiDesc) {
    return res.json({
      success: true,
      description: aiDesc
    });
  }

  // 2. Fallback to offline template hash-based generator
  const emotionalOpeners = [
    `This was the day when time seemed to slow down. Looking at this moment brings back that exact feeling of warmth.`,
    `A beautiful chapter written in the book of our lives. This snapshot holds the laughters, the secrets, and the silent promises we made to each other.`,
    `There are moments that get engraved in your heart forever, and this is definitely one of them.`,
    `Looking back at this moment, it reminds me of how far we have come and how precious every single second spent with you is.`,
    `A quiet reminder of the joy we share. It wasn't about the place, but about the laughter that filled the air.`,
    `They say a picture is worth a thousand words, but this memory of us is worth a lifetime of happiness.`
  ];

  const emotionalMiddles = [
    `Seeing you smile like this, without any worries, is my absolute favorite view in the world.`,
    `The way you laughed, the silly conversations we had, and the pure happiness in your eyes made everything else disappear.`,
    `Even when things get busy, this memory acts as my cozy shelter, reminding me of the simple, beautiful bond we share.`,
    `We were just being ourselves, capturing a fragment of pure joy that will remain untouched by time.`,
    `You have this magical way of making even the most ordinary days feel like a scene out of a beautiful movie.`
  ];

  const emotionalEndings = [
    `On your special day, I hope you look at this and remember how deeply you are loved. Happy Birthday! ❤️`,
    `Here's to this memory, and to the thousands of new ones we are yet to create together.`,
    `You are the heart of my happiest memories, and I promise to always cherish you just like this.`,
    `This day will always hold a special place in my life, because it has you in it.`,
    `May this smile remain on your face forever, because it makes the whole world shine brighter.`
  ];

  const openerIdx = title.length % emotionalOpeners.length;
  const middleIdx = (title.length + 3) % emotionalMiddles.length;
  const endingIdx = (title.length * 2) % emotionalEndings.length;

  const nameContext = recipientName ? `for you, ${recipientName}. ` : '';
  const description = `${emotionalOpeners[openerIdx]} ${nameContext}${emotionalMiddles[middleIdx]} ${emotionalEndings[endingIdx]}`;

  res.json({
    success: true,
    description
  });
};

// Recipient/Admin: Generate AI love letter
exports.generateAILetter = async (req, res) => {
  const { prompt, recipientName, senderName } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt context is required.' });
  }

  // 1. Try real Gemini generation
  const aiLetterText = await aiService.generateLetter(prompt, recipientName, senderName);
  if (aiLetterText) {
    return res.json({
      success: true,
      letter: aiLetterText
    });
  }

  // 2. Custom premium template fallback
  const rec = recipientName || 'Priye';
  const sen = senderName || 'Aapka';
  const letter = `Dear ${rec},\n\nFrom the moment you entered my life, everything felt brighter. Writing about "${prompt}" makes me look back at all the laughs and memories we created, and it fills my heart with gratitude. On your special day, I want to promise you that no matter how busy the world gets, my support and love for you will remain constant. Happy Birthday, and here is to a lifetime of beautiful new memories we are yet to write together.\n\nWith all my love,\n${sen}`;

  res.json({
    success: true,
    letter
  });
};

// Generic AI Text Generator
exports.generateAIText = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt context is required.' });
  }

  // 1. Try real Gemini generation
  const text = await aiService.generateGenericText(prompt);
  if (text) {
    return res.json({
      success: true,
      text
    });
  }

  // 2. Fallbacks
  let fallback = '';
  if (prompt.toLowerCase().includes('category') || prompt.toLowerCase().includes('description')) {
    fallback = 'Celebrate your special moments with Anka. A premium, interactive virtual surprise experience designed to wow your loved ones with animations, music, and memories.';
  } else {
    fallback = 'A special memory that we will cherish forever and look back on with love.';
  }

  res.json({
    success: true,
    text: fallback
  });
};
