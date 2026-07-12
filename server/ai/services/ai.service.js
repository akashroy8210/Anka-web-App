const fs = require('fs');
const path = require('path');
const config = require('../config/ai.config');
const OllamaProvider = require('../providers/ollama.provider');
const GeminiProvider = require('../providers/gemini.provider');

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
      ollama: new OllamaProvider(),
      gemini: new GeminiProvider()
    };
    this.activeProviderName = config.provider;
  }

  getActiveProvider() {
    const provider = this.providers[this.activeProviderName];
    if (!provider) {
      throw new Error(`AI Provider ${this.activeProviderName} is not recognized.`);
    }
    return provider;
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
   * Main text generation coordinator
   */
  async generateText(type, data = {}, options = {}) {
    const prompt = this.loadPrompt(type, data);
    const provider = this.getActiveProvider();
    return await provider.generate(prompt, options);
  }

  /**
   * Streaming text generation coordinator
   */
  async streamText(type, data = {}, onChunk, options = {}) {
    const prompt = this.loadPrompt(type, data);
    const provider = this.getActiveProvider();
    return await provider.streamGenerate(prompt, options, onChunk);
  }

  /**
   * Get active AI service health status
   */
  async checkHealth() {
    const provider = this.getActiveProvider();
    const health = await provider.health();
    return {
      running: health.running,
      provider: this.activeProviderName,
      model: this.activeProviderName === 'ollama' ? config.ollama.model : config.gemini.model,
      details: health.details
    };
  }
}

// Export singleton instance
module.exports = new AIService();
