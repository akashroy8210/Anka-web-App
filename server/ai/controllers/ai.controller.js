const aiService = require('../services/ai.service');

exports.generateText = async (req, res) => {
  const { type, data } = req.body;

  if (!type) {
    return res.status(400).json({ success: false, message: 'Generation type parameter is required.' });
  }

  try {
    const text = await aiService.generateText(type, data);
    return res.json({
      success: true,
      text: text
    });
  } catch (err) {
    console.error('AI generation controller error:', err);
    
    // Provide a friendly non-crashing response if Ollama is not active
    const isOllama = aiService.activeProviderName === 'ollama';
    const isOffline = err.message.toLowerCase().includes('connection failed') || 
                      err.message.toLowerCase().includes('fetch failed') ||
                      err.message.toLowerCase().includes('status 500') ||
                      err.message.toLowerCase().includes('timeout') ||
                      err.message.toLowerCase().includes('not running');

    if (isOllama && isOffline) {
      return res.status(200).json({
        success: false,
        errorType: 'OFFLINE',
        message: 'Local AI is not running. Please start Ollama.'
      });
    }

    return res.status(200).json({
      success: false,
      message: err.message || 'AI text generation failed.'
    });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const health = await aiService.checkHealth();
    return res.json({
      success: true,
      running: health.running,
      provider: health.provider,
      model: health.model,
      details: health.details
    });
  } catch (err) {
    console.error('AI status check controller error:', err);
    return res.json({
      success: true,
      running: false,
      provider: aiService.activeProviderName,
      message: 'Local AI connection failed. Please verify Ollama service status.'
    });
  }
};
