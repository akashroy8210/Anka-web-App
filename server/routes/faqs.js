const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const { verifyAdmin } = require('../middleware/auth');

const defaultFAQs = [
  {
    question: "How does Pyaar Ke Pal work?",
    answer: "Pyaar Ke Pal is an interactive surprise platform. You select an occasion (e.g. Birthday, Anniversary), customize the template with photos, text, and music in your private editor panel, and share the magical link with your loved one.",
    order: 1
  },
  {
    question: "How do I create a surprise website?",
    answer: "Just select a package category, complete the payment, and you will receive a secure passcode. Log in to the customizer panel to upload photos, customize milestones, and write custom messages.",
    order: 2
  },
  {
    question: "Can I customize everything?",
    answer: "Yes! You can edit recipient names, custom songs, photo galleries, romantic timelines, future dreams, and individual day card messages.",
    order: 3
  },
  {
    question: "Will my surprise remain private?",
    answer: "Absolutely. Recipient links are hidden from search engines (with strict SEO noindex directives) and are only accessible to people who have the private URL.",
    order: 4
  },
  {
    question: "Can I change it later?",
    answer: "Yes, you can edit the surprise configurations at any time from your customizer settings editor panel, even after sharing it with your partner.",
    order: 5
  },
  {
    question: "What happens after payment?",
    answer: "You will receive instant access to your Customer Customizer panel passcode via email and screen prompts to start designing your surprise.",
    order: 6
  },
  {
    question: "Do I get an Admin Panel?",
    answer: "Yes! Each order comes with a secure Settings Editor customizer to update files and a Client Live Control remote dashboard to trigger real-time features.",
    order: 7
  },
  {
    question: "Which package includes Live Surprise?",
    answer: "Real-time remote actions (confetti, heart rain, audio pushes, force reveals) are included in all of our Premium package tiers.",
    order: 8
  },
  {
    question: "Can I upload my own photos and music?",
    answer: "Yes, you can upload multiple slideshow photographs and link or upload your own custom MP3 romantic background loops.",
    order: 9
  },
  {
    question: "How long does setup take?",
    answer: "Setup is instant. Once you enter your photos and write your messages, the live preview link is ready to share immediately.",
    order: 10
  }
];

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    let faqs = await FAQ.find().sort({ order: 1 }).lean();
    if (faqs.length === 0) {
      // Return default FAQs list if collection is empty
      return res.json({ success: true, faqs: defaultFAQs });
    }
    res.json({ success: true, faqs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching FAQs.' });
  }
});

// Admin: Create FAQ
router.post('/', verifyAdmin, async (req, res) => {
  const { question, answer, order } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Question and answer are required.' });
  }
  try {
    const newFaq = new FAQ({ question, answer, order: order || 0 });
    await newFaq.save();
    res.status(201).json({ success: true, faq: newFaq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error creating FAQ.' });
  }
});

// Admin: Update FAQ
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await FAQ.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }
    res.json({ success: true, faq: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating FAQ.' });
  }
});

// Admin: Delete FAQ
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await FAQ.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }
    res.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting FAQ.' });
  }
});

module.exports = router;
