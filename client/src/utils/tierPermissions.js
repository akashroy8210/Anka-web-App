/**
 * Unified Tier Permission Helper
 * Resolves feature permissions and limits dynamically based on tierName and categoryTiers from DB for each app
 */
export function getTierPermissions(tierName = '', categoryTiers = []) {
  const normalizedTier = String(tierName || '').toLowerCase().trim();

  // Find tier object directly from database categoryTiers array for the active app/occasion
  const dbTier = (categoryTiers || []).find(t => (t.name || '').toLowerCase() === normalizedTier) ||
                 (categoryTiers && categoryTiers[0]) || {};

  const dbLimits = dbTier?.limits || {};
  const inclusionsStr = (dbTier?.inclusions || []).join(' ').toLowerCase();

  const isPremium = (dbTier.name || '').toLowerCase() === 'premium' || normalizedTier === 'premium';
  const isBasic = !isPremium;

  return {
    tierName: dbTier.name || (isPremium ? 'Premium' : 'Basic'),
    isPremium,
    isBasic,
    dbTier,
    limits: dbLimits,

    // Dynamic Feature Flags (Derived 100% dynamically from active DB tier limits & inclusions)
    hasVoiceNotes: dbLimits.hasVoiceNotes !== undefined ? Boolean(dbLimits.hasVoiceNotes) : (inclusionsStr.includes('voice') || inclusionsStr.includes('audio') || isPremium),
    hasVideoUploads: dbLimits.hasVideoUploads !== undefined ? Boolean(dbLimits.hasVideoUploads) : (inclusionsStr.includes('video') || isPremium),
    hasLockGates: dbLimits.hasLockGates !== undefined ? Boolean(dbLimits.hasLockGates) : isPremium,
    hasFutureDreams: dbLimits.hasFutureDreams !== undefined ? Boolean(dbLimits.hasFutureDreams) : isPremium,
    hasSkyMemories: dbLimits.hasSkyMemories !== undefined ? Boolean(dbLimits.hasSkyMemories) : isPremium,
    hasLiveControl: dbLimits.hasLiveControl !== undefined ? Boolean(dbLimits.hasLiveControl) : (inclusionsStr.includes('live control') || inclusionsStr.includes('real-time') || isPremium),

    // Dynamic App Limits (Reads DB limits directly from the active app's categoryTiers)
    photosLimit: dbLimits.photosLimit !== undefined ? Number(dbLimits.photosLimit) : 15,
    timelineLimit: dbLimits.timelineLimit !== undefined ? Number(dbLimits.timelineLimit) : 10,
    reasonsLimit: dbLimits.reasonsLimit !== undefined ? Number(dbLimits.reasonsLimit) : 12,
    dreamsLimit: dbLimits.dreamsLimit !== undefined ? Number(dbLimits.dreamsLimit) : 6,
    starsLimit: dbLimits.starsLimit !== undefined ? Number(dbLimits.starsLimit) : 15,
    favoritesLimit: dbLimits.favoritesLimit !== undefined ? Number(dbLimits.favoritesLimit) : 999
  };
}

export default getTierPermissions;
