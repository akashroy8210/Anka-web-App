import { api } from '../services/api.service';

const getSessionId = () => {
  try {
    let sid = sessionStorage.getItem('anka_session_id');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      sessionStorage.setItem('anka_session_id', sid);
    }
    return sid;
  } catch (err) {
    return 'sid_fallback_' + Date.now();
  }
};

/**
 * Tracks custom user interactions and sends them to the backend analytics tracker.
 * @param {string} eventName - Name of the event (must match enum values)
 * @param {object} data - Metadata of the event
 */
export const trackEvent = async (eventName, data = {}) => {
  try {
    const payload = {
      eventName,
      categorySlug: data.categorySlug || null,
      themeSlug: data.themeSlug || null,
      tier: data.tier || null,
      price: data.price || 0,
      instanceId: data.instanceId || null,
      sessionId: getSessionId(),
      metadata: data.metadata || {}
    };

    // Fire-and-forget logging to backend
    api.trackEvent(payload);
  } catch (err) {
    console.warn('Silent analytics track failure:', eventName, err);
  }
};
