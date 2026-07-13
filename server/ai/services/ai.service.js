const fs = require('fs');
const path = require('path');
const config = require('../config/ai.config');
const GeminiProvider = require('../providers/gemini.provider');
const PollinationsProvider = require('../providers/pollinations.provider');

const promptMappings = {
  memory: 'birthday/memory.prompt.txt',
  loveLetter: 'birthday/letter.prompt.txt',
  quote: 'birthday/quote.prompt.txt',
  timeline: 'virtual-date/timeline.prompt.txt',
  love: 'virtual-date/love.prompt.txt',
  futureDream: 'virtual-date/futureDream.prompt.txt',
  rewrite: 'common/rewrite.prompt.txt'
};

class AIService {
  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
      pollinations: new PollinationsProvider()
    };
    // Default fallback order
    this.providerOrder = ['gemini', 'pollinations'];
  }

  /**
   * Load and hydrate prompt template by template type name
   * @param {string} type - Template type name
   * @param {object} data - Hydration key-values
   */
  loadPrompt(type, data = {}) {
    const relativePath = promptMappings[type];
    if (!relativePath) {
      throw new Error(`Unknown prompt template type: ${type}`);
    }

    const fullPath = path.join(__dirname, '../prompts', relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Prompt template file not found at ${fullPath}`);
    }

    let template = fs.readFileSync(fullPath, 'utf8');

    // Replace all placeholder tags {{KEY}} with values from data
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      template = template.replace(regex, data[key] ?? '');
    });

    return template;
  }

  /**
   * Main text generation coordinator with automatic fallback
   */
  async generateText(type, data = {}, options = {}) {
    const prompt = this.loadPrompt(type, data);
    
    let lastError = null;
    for (const providerName of this.providerOrder) {
      const provider = this.providers[providerName];
      const health = await provider.health();
      
      // Skip if provider is not configured (e.g. missing API key)
      if (providerName === 'gemini' && !health.running) {
        console.log('[AI Engine] Skipping Gemini because it is not configured (no key).');
        continue;
      }

      try {
        console.log(`[AI Engine] Attempting text generation via provider: ${providerName}`);
        const text = await provider.generate(prompt, options);
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (err) {
        console.error(`[AI Engine] Provider ${providerName} generation failed:`, err.message);
        lastError = err;
      }
    }

    console.error('[AI Engine] All providers failed. Throwing friendly fallback error.');
    throw new Error('Unable to generate right now. Please try again in a moment.');
  }

  /**
   * Streaming text generation coordinator with automatic fallback
   */
  async streamText(type, data = {}, onChunk, options = {}) {
    const prompt = this.loadPrompt(type, data);
    
    let lastError = null;
    for (const providerName of this.providerOrder) {
      const provider = this.providers[providerName];
      const health = await provider.health();
      
      // Skip if provider is not configured
      if (providerName === 'gemini' && !health.running) {
        continue;
      }

      try {
        console.log(`[AI Engine] Attempting streaming text generation via provider: ${providerName}`);
        await provider.streamGenerate(prompt, options, onChunk);
        return;
      } catch (err) {
        console.error(`[AI Engine] Provider ${providerName} streaming failed:`, err.message);
        lastError = err;
      }
    }

    console.error('[AI Engine] All streaming providers failed. Throwing friendly fallback error.');
    throw new Error('Unable to generate right now. Please try again in a moment.');
  }

  /**
   * Get active AI service health status (returns active configured or fallback provider)
   */
  async checkHealth() {
    const geminiHealth = await this.providers.gemini.health();
    if (geminiHealth.running) {
      return {
        running: true,
        provider: 'gemini',
        model: config.gemini.model,
        details: geminiHealth.details
      };
    }

    const pollinationsHealth = await this.providers.pollinations.health();
    return {
      running: pollinationsHealth.running,
      provider: 'pollinations',
      model: 'openai/free-fallback',
      details: pollinationsHealth.details
    };
  }
}

// Export singleton instance
module.exports = new AIService();
