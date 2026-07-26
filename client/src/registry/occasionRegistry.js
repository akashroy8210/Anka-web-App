import React, { lazy } from 'react';

export const OccasionRegistry = {
  'birthday': {
    view: lazy(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazy(() => import('../apps/birthday/components/BirthdayCustomizer')),
    control: lazy(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'virtual-date': {
    view: lazy(() => import('../apps/virtual-date/App').then(module => ({ default: module.VirtualDateSurprise }))),
    customizer: lazy(() => import('../apps/virtual-date/components/VirtualDateCustomizer')),
    control: lazy(() => import('../apps/virtual-date/components/VirtualDateControl'))
  },
  'valentine': {
    view: lazy(() => import('../apps/valentine/App')),
    customizer: lazy(() => import('../apps/valentine/component/ValentineCustomizer')),
    control: lazy(() => import('../apps/valentine/component/ValentineControl'))
  },
  'proposal': {
    view: lazy(() => import('../apps/proposal/ProposalSurprise')),
    customizer: lazy(() => import('../apps/proposal/components/ProposalCustomizer')),
    control: lazy(() => import('../apps/proposal/components/ProposalControl'))
  },
  'wedding-invitation': {
    view: lazy(() => import('../apps/proposal/ProposalSurprise')),
    customizer: lazy(() => import('../apps/proposal/components/ProposalCustomizer')),
    control: lazy(() => import('../apps/proposal/components/ProposalControl'))
  },
  'wedding-surprise': {
    view: lazy(() => import('../apps/proposal/ProposalSurprise')),
    customizer: lazy(() => import('../apps/proposal/components/ProposalCustomizer')),
    control: lazy(() => import('../apps/proposal/components/ProposalControl'))
  },
  'new-year': {
    view: lazy(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazy(() => import('../apps/birthday/components/BirthdayCustomizer')),
    control: lazy(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'best-friend': {
    view: lazy(() => import('../apps/valentine/App')),
    customizer: lazy(() => import('../apps/valentine/component/ValentineCustomizer')),
    control: lazy(() => import('../apps/valentine/component/ValentineControl'))
  },
  'friendship-day': {
    view: lazy(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazy(() => import('../apps/birthday/components/BirthdayCustomizer')),
    control: lazy(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'random-day': {
    view: lazy(() => import('../apps/virtual-date/App').then(module => ({ default: module.VirtualDateSurprise }))),
    customizer: lazy(() => import('../apps/virtual-date/components/VirtualDateCustomizer')),
    control: lazy(() => import('../apps/virtual-date/components/VirtualDateControl'))
  }
};

/**
 * Utility helper to extract a clean registry slug key matching the database category or theme slug
 * @param {string} slug 
 * @returns {string} Target occasion registry key
 */
export function getOccasionKey(slug) {
  if (!slug) return 'virtual-date';
  const s = String(slug).toLowerCase().trim();

  if (OccasionRegistry[s]) return s;

  // Theme slug aliases
  if (s.includes('starry') || s.includes('virtual') || s.includes('sanctuary') || s.includes('cozy') || s.includes('girlfriend') || s.includes('random')) return 'virtual-date';
  if (s.includes('birthday') || s.includes('bday') || s.includes('cake')) return 'birthday';
  if (s.includes('valentine') || s.includes('rose') || s.includes('hug') || s.includes('neon-passion')) return 'valentine';
  if (s.includes('proposal') || s.includes('ring') || s.includes('marry') || s.includes('wedding')) return 'proposal';
  if (s.includes('new-year') || s.includes('friendship') || s.includes('best-friend')) return 'birthday';

  // Safe fallback to virtual-date instead of crashing on birthday
  return 'virtual-date';
}
