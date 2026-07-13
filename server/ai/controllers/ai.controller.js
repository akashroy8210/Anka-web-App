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
    return res.status(200).json({
      success: false,
      message: 'Unable to generate right now. Please try again in a moment.'
    });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const health = await aiService.checkHealth();
    return res.json({
      success: true,
      running: true, // Always running due to free public fallback
      provider: health.provider,
      model: health.model,
      details: health.details
    });
  } catch (err) {
    console.error('AI status check controller error:', err);
    return res.json({
      success: true,
      running: true,
      provider: 'fallback',
      message: 'AI Provider active in fallback mode.'
    });
  }
};
