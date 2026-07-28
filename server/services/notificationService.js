/**
 * WhatsApp & SMS Instant Order Confirmation Service
 * Uses Twilio WhatsApp API for sending surprise links and notifications directly to customer mobile numbers.
 */

const logger = require('../utils/logger');
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

exports.sendWhatsAppCredentials = async ({ customerName, customerPhone, instanceId, categoryName }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!customerPhone) {
    logger.info('[WhatsApp] Customer phone not provided. Skipping WhatsApp notification.');
    return;
  }

  if (!accountSid || !authToken || !fromNumber) {
    logger.warn('[WhatsApp] Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER) are not set in environment.');
    return;
  }

  // Format recipient phone number for WhatsApp E.164
  let formattedPhone = customerPhone.replace(/\D/g, '');
  if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
    formattedPhone = `91${formattedPhone}`;
  }

  const messageText = `🎉 *Your AnKa Surprise is Ready!* 🎉\n\nDear *${customerName || 'Customer'}*,\nThank you for purchasing *${categoryName || 'Surprise'}* on AnKa!\n\n🔑 *Access Your Surprise:*\n• Customer Dashboard: ${CLIENT_URL}/dashboard\n• Surprise ID: *${instanceId}*\n\n👉 *View Live Surprise Link:*\n${CLIENT_URL}/s/${instanceId}\n\nWith love,\nTeam AnKa — Pyaar Ke Pal ❤️`;

  try {
    const twilio = require('twilio')(accountSid, authToken);
    const res = await twilio.messages.create({
      body: messageText,
      from: fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`,
      to: `whatsapp:+${formattedPhone}`
    });
    logger.info(`[WhatsApp] Successfully dispatched WhatsApp notification to +${formattedPhone} (SID: ${res.sid})`);
    return { success: true, sid: res.sid };
  } catch (err) {
    logger.error(`[WhatsApp] Failed to send WhatsApp message via Twilio: ${err.message}`);
    throw err;
  }
};
