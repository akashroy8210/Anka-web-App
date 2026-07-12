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

const newAIService = require('../ai/services/ai.service');

// Helper: Generate memory description
exports.generateMemoryDescription = async (title, recipientName) => {
  try {
    return await newAIService.generateText('memory', { TITLE: title, RECIPIENT_NAME: recipientName });
  } catch (err) {
    console.error('Legacy bridge memory desc error:', err);
    return null;
  }
};

// Helper: Generate letter content
exports.generateLetter = async (promptText, recipientName, senderName) => {
  try {
    return await newAIService.generateText('loveLetter', { PROMPT: promptText, RECIPIENT_NAME: recipientName, SENDER_NAME: senderName });
  } catch (err) {
    console.error('Legacy bridge letter generation error:', err);
    return null;
  }
};

// Helper: Generate generic AI text based on prompt
exports.generateGenericText = async (promptText) => {
  try {
    const provider = newAIService.getActiveProvider();
    return await provider.generate(promptText);
  } catch (err) {
    console.error('Legacy bridge generic text error:', err);
    return null;
  }
};


