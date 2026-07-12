class BaseProvider {
  /**
   * Generate text response synchronously/asynchronously.
   * @param {string} prompt - Fully hydrated prompt string.
   * @param {object} [options] - Additional parameters (temperature, maxTokens, etc.).
   * @returns {Promise<string>} Generated text content.
   */
  async generate(prompt, options) {
    throw new Error('Method generate() must be implemented.');
  }

  /**
   * Stream the generated text chunk by chunk.
   * @param {string} prompt - Fully hydrated prompt string.
   * @param {object} [options] - Additional parameters.
   * @param {function} onChunk - Callback returning each text chunk.
   * @returns {Promise<void>}
   */
  async streamGenerate(prompt, options, onChunk) {
    throw new Error('Method streamGenerate() must be implemented.');
  }

  /**
   * Check connection and readiness of the provider.
   * @returns {Promise<{ running: boolean, details: string }>}
   */
  async health() {
    throw new Error('Method health() must be implemented.');
  }
}

module.exports = BaseProvider;
