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
  if (!slug) return 'birthday';
  const s = slug.toLowerCase().trim();

  if (OccasionRegistry[s]) return s;

  if (s.includes('birthday')) return 'birthday';
  if (s.includes('virtual-date') || s.includes('virtual date')) return 'virtual-date';
  if (s.includes('valentine')) return 'valentine';
  if (s.includes('proposal')) return 'proposal';
  if (s.includes('wedding-invitation') || s.includes('wedding invitation')) return 'wedding-invitation';
  if (s.includes('wedding-surprise') || s.includes('wedding surprise')) return 'wedding-surprise';
  if (s.includes('new-year') || s.includes('new year')) return 'new-year';
  if (s.includes('best-friend') || s.includes('best friend')) return 'best-friend';
  if (s.includes('friendship')) return 'friendship-day';
  if (s.includes('random')) return 'random-day';

  

  return 'birthday';
}
