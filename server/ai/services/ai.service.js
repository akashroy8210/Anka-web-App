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

function cleanGeneratedText(text) {
  if (!text) return '';
  let cleaned = text.trim();

  // 1. Strip thinking tags <think>...</think>
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. If it's a JSON string representing role/assistant/reasoning/content
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.content) {
        cleaned = parsed.content.trim();
      } else if (parsed.response) {
        cleaned = parsed.response.trim();
      } else if (parsed.text) {
        cleaned = parsed.text.trim();
      }
    } catch (e) {
      // Ignore parse failure
    }
  }

  // 3. Strip markdown code block wrapping if the model returned ```json or ```text
  if (cleaned.startsWith('```')) {
    const lines = cleaned.split('\n');
    if (lines[0].startsWith('```')) {
      lines.shift();
    }
    if (lines[lines.length - 1].startsWith('```')) {
      lines.pop();
    }
    cleaned = lines.join('\n').trim();
  }

  // 4. Double check if the resulting text is still JSON
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.content) {
        cleaned = parsed.content.trim();
      }
    } catch (e) {}
  }

  // 5. Final fallback strip just in case formatting got weird
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  return cleaned;
}

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
          return cleanGeneratedText(text);
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

  /**
   * Get the active provider based on API config settings
   */
  getActiveProvider() {
    const gemini = this.providers.gemini;
    if (gemini && gemini.apiKey) {
      return gemini;
    }
    return this.providers.pollinations;
  }

  /**
   * Exposed cleanText utility method
   */
  cleanText(text) {
    return cleanGeneratedText(text);
  }
}

// Export singleton instance
module.exports = new AIService();
