export const DemoRegistry = {
  'birthday': {
    fields: [
      { key: 'demoVideo', label: 'Demo Video URL', type: 'text', icon: '🎥' },
      { key: 'livePreview', label: 'Live Preview URL', type: 'text', icon: '🌐' },
      { key: 'countdownDemo', label: 'Countdown Demo URL', type: 'text', icon: '⏰' },
      { key: 'memoryTreeDemo', label: 'Memory Tree Demo URL', type: 'text', icon: '🌳' },
      { key: 'birthdaySongDemo', label: 'Birthday Song Demo URL', type: 'text', icon: '🎵' },
      { key: 'aiCakeFeedingPreview', label: 'AI Cake Feeding Preview URL', type: 'text', icon: '🍰' }
    ]
  },
  'virtual-date': {
    fields: [
      { key: 'demoVideo', label: 'Demo Video URL', type: 'text', icon: '🎥' },
      { key: 'livePreview', label: 'Live Preview URL', type: 'text', icon: '🌐' },
      { key: 'timelineStoryDemo', label: 'Timeline Story Demo URL', type: 'text', icon: '📅' },
      { key: 'voiceNoteDemo', label: 'Voice Note Demo URL', type: 'text', icon: '🎙️' },
      { key: 'thingsILoveDemo', label: 'Things I Love Demo URL', type: 'text', icon: '❤️' },
      { key: 'futureDreamsDemo', label: 'Future Dreams Demo URL', type: 'text', icon: '🌌' },
      { key: 'comfortQuotesDemo', label: 'Comfort Quotes Demo URL', type: 'text', icon: '📜' },
      { key: 'loveLetterDemo', label: 'Love Letter Demo URL', type: 'text', icon: '💌' },
      { key: 'liveControlDemo', label: 'Live Control Demo URL', type: 'text', icon: '⚡' }
    ]
  },
  'valentine': {
    fields: [
      { key: 'demoVideo', label: 'Demo Video URL', type: 'text', icon: '🎥' },
      { key: 'livePreview', label: 'Live Preview URL', type: 'text', icon: '🌐' },
      { key: 'timelineStoryDemo', label: 'Timeline Story Demo URL', type: 'text', icon: '📅' },
      { key: 'voiceNoteDemo', label: 'Voice Note Demo URL', type: 'text', icon: '🎙️' },
      { key: 'thingsILoveDemo', label: 'Things I Love Demo URL', type: 'text', icon: '❤️' }
    ]
  },
  'proposal': {
    fields: [
      { key: 'proposalJourneyDemo', label: 'Proposal Journey Demo URL', type: 'text', icon: '💍' },
      { key: 'ringRevealDemo', label: 'Ring Reveal Demo URL', type: 'text', icon: '💎' },
      { key: 'countdownDemo', label: 'Countdown Demo URL', type: 'text', icon: '⏰' },
      { key: 'finalSurpriseDemo', label: 'Final Surprise Demo URL', type: 'text', icon: '🎁' }
    ]
  }
};

export function getDemoConfig(categorySlug) {
  if (!categorySlug) return DemoRegistry['birthday'];
  const slug = categorySlug.toLowerCase();
  if (slug.includes('birthday')) return DemoRegistry['birthday'];
  if (slug.includes('virtual-date') || slug.includes('virtual date')) return DemoRegistry['virtual-date'];
  if (slug.includes('valentine')) return DemoRegistry['valentine'];
  if (slug.includes('proposal')) return DemoRegistry['proposal'];
  
  // Safe default fallback for future-proofing
  return {
    fields: [
      { key: 'demoVideo', label: 'Demo Video URL', type: 'text', icon: '🎥' },
      { key: 'livePreview', label: 'Live Preview URL', type: 'text', icon: '🌐' }
    ]
  };
}
