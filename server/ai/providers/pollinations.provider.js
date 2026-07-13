const BaseProvider = require('./base.provider');

class PollinationsProvider extends BaseProvider {
  constructor() {
    super();
    this.modelName = 'openai';
  }

  async generate(prompt, options = {}) {
    try {
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: prompt }
          ],
          model: options.model || this.modelName
        })
      });

      if (!response.ok) {
        throw new Error(`Pollinations API responded with status ${response.status}`);
      }

      const text = await response.text();
      return text.trim();
    } catch (err) {
      throw new Error(`Pollinations generation failed: ${err.message}`);
    }
  }

  async streamGenerate(prompt, options = {}, onChunk) {
    try {
      const text = await this.generate(prompt, options);
      onChunk(text);
    } catch (err) {
      throw new Error(`Pollinations streaming failed: ${err.message}`);
    }
  }

  async health() {
    // Pollinations AI is always public and doesn't require keys
    return { running: true, details: 'Pollinations AI free provider is active' };
  }
}

module.exports = PollinationsProvider;
