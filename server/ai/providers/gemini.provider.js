const BaseProvider = require('./base.provider');
const config = require('../config/ai.config');
let GoogleGenerativeAI = null;

try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  // Ignored if package is not present
}

class GeminiProvider extends BaseProvider {
  constructor() {
    super();
    this.apiKey = config.gemini.apiKey;
    this.modelName = config.gemini.model;
    this.genAI = null;

    if (GoogleGenerativeAI && this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generate(prompt, options = {}) {
    if (!this.genAI) {
      throw new Error('Gemini API key is not configured.');
    }
    try {
      const model = this.genAI.getGenerativeModel({ model: options.model || this.modelName });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature ?? config.temperature,
          maxOutputTokens: options.maxTokens ?? config.maxTokens
        }
      });
      return result.response.text().trim();
    } catch (err) {
      throw new Error(`Gemini generation failed: ${err.message}`);
    }
  }

  async streamGenerate(prompt, options = {}, onChunk) {
    if (!this.genAI) {
      throw new Error('Gemini API key is not configured.');
    }
    try {
      const model = this.genAI.getGenerativeModel({ model: options.model || this.modelName });
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature ?? config.temperature,
          maxOutputTokens: options.maxTokens ?? config.maxTokens
        }
      });

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          onChunk(text);
        }
      }
    } catch (err) {
      throw new Error(`Gemini streaming failed: ${err.message}`);
    }
  }

  async health() {
    if (!this.apiKey) {
      return { running: false, details: 'GEMINI_API_KEY is not defined' };
    }
    try {
      // Basic check - try to get a model reference
      if (this.genAI) {
        this.genAI.getGenerativeModel({ model: this.modelName });
        return { running: true, details: `Gemini active with model ${this.modelName}` };
      }
      return { running: false, details: 'Gemini SDK failed to initialize' };
    } catch (err) {
      return { running: false, details: `Gemini status check failed: ${err.message}` };
    }
  }
}

module.exports = GeminiProvider;
