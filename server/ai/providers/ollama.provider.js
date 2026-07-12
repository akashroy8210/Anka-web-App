const BaseProvider = require('./base.provider');
const config = require('../config/ai.config');

class OllamaProvider extends BaseProvider {
  constructor() {
    super();
    this.url = config.ollama.url;
    this.model = config.ollama.model;
  }

  async generate(prompt, options = {}) {
    try {
      const response = await fetch(`${this.url}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: options.model || this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: options.temperature ?? config.temperature,
            num_predict: options.maxTokens ?? config.maxTokens
          }
        }),
        signal: AbortSignal.timeout(30000) // 30s timeout
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}`);
      }

      const data = await response.json();
      return data.response ? data.response.trim() : '';
    } catch (err) {
      if (err.name === 'TimeoutError') {
        throw new Error('Ollama request timed out after 30 seconds.');
      }
      throw new Error(`Ollama generation failed: ${err.message}`);
    }
  }

  async streamGenerate(prompt, options = {}, onChunk) {
    try {
      const response = await fetch(`${this.url}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: options.model || this.model,
          prompt: prompt,
          stream: true,
          options: {
            temperature: options.temperature ?? config.temperature,
            num_predict: options.maxTokens ?? config.maxTokens
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          // Parse lines (each is a JSON object)
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsed = JSON.parse(line);
                if (parsed.response) {
                  onChunk(parsed.response);
                }
              } catch (e) {
                // Ignore parse errors on incomplete lines
              }
            }
          }
        }
      }
    } catch (err) {
      throw new Error(`Ollama streaming failed: ${err.message}`);
    }
  }

  async health() {
    try {
      // Query tag lists or base status to check server is responsive
      const res = await fetch(`${this.url}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // Fast 3s timeout
      });
      if (res.ok) {
        return { running: true, details: `Ollama active at ${this.url}` };
      }
      return { running: false, details: `Ollama status: ${res.status}` };
    } catch (err) {
      return { running: false, details: `Ollama connection failed: ${err.message}` };
    }
  }
}

module.exports = OllamaProvider;
