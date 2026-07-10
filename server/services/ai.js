const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Initialise Gemini
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Helper: Generate memory description
exports.generateMemoryDescription = async (title, recipientName) => {
  if (!genAI) {
    return null; // Fallback will be handled in controller
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Write a short, nostalgic, and emotional 1-2 sentence description for a memory titled "${title}" between me and ${recipientName} for a birthday surprise Memory Tree. Keep it poetic, heartfelt, and warm.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini memory desc error:', err);
    return null;
  }
};

// Helper: Generate letter content
exports.generateLetter = async (promptText, recipientName, senderName) => {
  if (!genAI) {
    return null;
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Write a deeply emotional, romantic, and cinematic birthday love letter for a birthday surprise site. The recipient's name is ${recipientName} and the sender's name is ${senderName}. The user provided this prompt/context: "${promptText}". Keep it warm, magical, and intimate. Write in natural Hinglish/English style. Keep it under 150 words. Do not write any placeholders like [Name].`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini letter generation error:', err);
    return null;
  }
};

// Helper: Generate generic AI text based on prompt
exports.generateGenericText = async (promptText) => {
  if (!genAI) {
    return null;
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(promptText);
    return result.response.text().trim();
  } catch (err) {
    console.error('Gemini generic text error:', err);
    return null;
  }
};


