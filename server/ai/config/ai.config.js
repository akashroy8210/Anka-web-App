module.exports = {
  provider: process.env.AI_PROVIDER || 'gemini',
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '300', 10),
  streaming: process.env.AI_STREAMING === 'true',
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  }
};
