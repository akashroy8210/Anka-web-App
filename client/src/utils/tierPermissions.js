/**
 * Unified Tier Permission Helper
 * Resolves feature permissions and limits dynamically based on tierName and categoryTiers from DB
 */
export function getTierPermissions(tierName = '', categoryTiers = []) {
  const normalizedTier = String(tierName || '').toLowerCase().trim();
  const isPremium = normalizedTier === 'premium';
  const isBasic = !isPremium;

  // Find tier object from database categoryTiers array if available
  const dbTier = (categoryTiers || []).find(t => (t.name || '').toLowerCase() === normalizedTier) ||
                 (categoryTiers || []).find(t => (t.name || '').toLowerCase() === (isPremium ? 'premium' : 'basic')) ||
                 (categoryTiers && categoryTiers[0]);

  const dbLimits = dbTier?.limits || {};

  return {
    tierName: isPremium ? 'Premium' : 'Basic',
    isPremium,
    isBasic,
    dbTier,
    limits: dbLimits,

    // Dynamic Feature Flags (Unlocked for Premium or if DB limits explicitly set to true)
    hasVoiceNotes: isPremium || dbLimits.hasVoiceNotes === true,
    hasVideoUploads: isPremium || dbLimits.hasVideoUploads === true,
    hasLockGates: isPremium || dbLimits.hasLockGates === true,
    hasFutureDreams: isPremium || dbLimits.hasFutureDreams === true,
    hasSkyMemories: isPremium || dbLimits.hasSkyMemories === true,
    hasLiveControl: isPremium || dbLimits.hasLiveControl === true,

    // Dynamic Limits (Reads DB tier limit first, with tier-appropriate defaults)
    photosLimit: dbLimits.photosLimit || (isBasic ? 3 : 15),
    timelineLimit: dbLimits.timelineLimit || (isBasic ? 3 : 10),
    reasonsLimit: dbLimits.reasonsLimit || (isBasic ? 6 : 12),
    dreamsLimit: dbLimits.dreamsLimit || (isBasic ? 3 : 6),
    starsLimit: dbLimits.starsLimit || (isBasic ? 5 : 15),
    favoritesLimit: isBasic ? (dbLimits.favoritesLimit || 6) : 999
  };
}

export default getTierPermissions;
