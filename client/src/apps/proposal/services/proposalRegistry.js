import React from 'react';
import { PROPOSAL_STAGES } from '../constants/stages';

// Lazy-load sections for clean performance optimization
const HeroSection = React.lazy(() => import('../sections/HeroSection'));
const IntroductionSection = React.lazy(() => import('../sections/IntroductionSection'));
const EverythingAboutYou = React.lazy(() => import('../sections/EverythingAboutYou'));
const RevealSection = React.lazy(() => import('../sections/RevealSection'));
const FirstLookSection = React.lazy(() => import('../sections/FirstLookSection'));
const TimelineSection = React.lazy(() => import('../sections/TimelineSection'));
const ReasonsSection = React.lazy(() => import('../sections/ReasonsSection'));
const LetterSection = React.lazy(() => import('../sections/LetterSection'));
const MemorySkySection = React.lazy(() => import('../sections/MemorySkySection'));
const ProposalRingSection = React.lazy(() => import('../sections/ProposalRingSection'));
const CelebrationSection = React.lazy(() => import('../sections/CelebrationSection'));

export const ProposalRegistry = [
  {
    id: PROPOSAL_STAGES.ENTRY,
    component: HeroSection,
    requiresData: () => true
  },
  {
    id: PROPOSAL_STAGES.PROFILE,
    component: IntroductionSection,
    requiresData: (config) => !!(config.proposalStarPhoto || config.proposalStarName)
  },
  {
    id: PROPOSAL_STAGES.FAVORITES,
    component: EverythingAboutYou,
    requiresData: (config) => !!(
      config.proposalHobbies || 
      config.proposalFavFood || 
      config.proposalFavSongs || 
      config.proposalFavPlace || 
      config.proposalFavCafe || 
      config.proposalFavMovie || 
      config.proposalFavFlower
    )
  },
  {
    id: PROPOSAL_STAGES.REVEAL,
    component: RevealSection,
    requiresData: () => true
  },
  {
    id: PROPOSAL_STAGES.FIRSTMEET,
    component: FirstLookSection,
    requiresData: (config) => !!config.proposalFirstPhoto
  },
  {
    id: PROPOSAL_STAGES.TIMELINE,
    component: TimelineSection,
    requiresData: (config) => config.proposalTimeline && config.proposalTimeline.length > 0
  },
  {
    id: PROPOSAL_STAGES.REASONS,
    component: ReasonsSection,
    requiresData: (config) => config.proposalReasons && config.proposalReasons.length > 0
  },
  {
    id: PROPOSAL_STAGES.LETTERS,
    component: LetterSection,
    requiresData: (config) => config.proposalLetters && config.proposalLetters.length > 0
  },
  {
    id: PROPOSAL_STAGES.SKY,
    component: MemorySkySection,
    requiresData: (config) => config.proposalSkyMemories && config.proposalSkyMemories.length > 0
  },
  {
    id: PROPOSAL_STAGES.PROPOSAL,
    component: ProposalRingSection,
    requiresData: () => true
  },
  {
    id: PROPOSAL_STAGES.CELEBRATION,
    component: CelebrationSection,
    requiresData: () => true
  }
];

export function getVisibleStages(config) {
  return ProposalRegistry
    .filter(section => section.requiresData(config))
    .map(section => section.id);
}
