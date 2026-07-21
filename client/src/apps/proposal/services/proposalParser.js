import { PROPOSAL_DEFAULTS } from '../constants/defaults';

export function parseProposalConfig(config, instance) {
  const cfg = config || {};
  return {
    recipientName: instance?.recipientName || cfg.recipientName || PROPOSAL_DEFAULTS.recipientName,
    senderName: instance?.senderName || cfg.senderName || PROPOSAL_DEFAULTS.senderName,
    
    // Star Profile
    proposalStarPhoto: cfg.proposalStarPhoto || '',
    proposalStarName: cfg.proposalStarName || instance?.recipientName || PROPOSAL_DEFAULTS.recipientName,
    proposalStarNickname: cfg.proposalStarNickname || '',
    proposalStarIntro: cfg.proposalStarIntro || '',

    // Favorites
    proposalHobbies: cfg.proposalHobbies || '',
    proposalFavFood: cfg.proposalFavFood || '',
    proposalFavSongs: cfg.proposalFavSongs || '',
    proposalFavPlace: cfg.proposalFavPlace || '',
    proposalFavCafe: cfg.proposalFavCafe || '',
    proposalFavMovie: cfg.proposalFavMovie || '',
    proposalFavFlower: cfg.proposalFavFlower || '',

    // First Look
    proposalFirstPhoto: cfg.proposalFirstPhoto || '',
    proposalFirstDate: cfg.proposalFirstDate || '',
    proposalFirstLocation: cfg.proposalFirstLocation || '',
    proposalFirstTitle: cfg.proposalFirstTitle || '',
    proposalFirstDesc: cfg.proposalFirstDesc || '',

    // Playlists & Arrays
    proposalTimeline: Array.isArray(cfg.proposalTimeline) ? cfg.proposalTimeline : [],
    proposalReasons: Array.isArray(cfg.proposalReasons) ? cfg.proposalReasons : [],
    proposalLetters: Array.isArray(cfg.proposalLetters) ? cfg.proposalLetters : [],
    proposalSkyMemories: Array.isArray(cfg.proposalSkyMemories) ? cfg.proposalSkyMemories : [],

    // Action Overlays
    proposalQuestion: cfg.proposalQuestion || PROPOSAL_DEFAULTS.proposalQuestion,
    proposalYesBtn: cfg.proposalYesBtn || PROPOSAL_DEFAULTS.proposalYesBtn,
    proposalThinkBtn: cfg.proposalThinkBtn || PROPOSAL_DEFAULTS.proposalThinkBtn,
    proposalThinkResponse: cfg.proposalThinkResponse || PROPOSAL_DEFAULTS.proposalThinkResponse,
    
    // Music
    musicUrl: cfg.musicUrl || cfg.backgroundMusic || PROPOSAL_DEFAULTS.musicUrl,
    proposalCelebrationMusic: cfg.proposalCelebrationMusic || '',
    proposalCelebrateLetter: cfg.proposalCelebrateLetter || ''
  };
}
