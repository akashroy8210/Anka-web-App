import React, { lazy } from 'react';

const lazyWithPreload = (factory) => {
  const Component = lazy(factory);
  Component.preload = factory;
  return Component;
};

export const OccasionRegistry = {
  'birthday': {
    view: lazyWithPreload(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazyWithPreload(() => import('../apps/birthday/components/BirthdayCustomizer')),
    control: lazyWithPreload(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'virtual-date': {
    view: lazyWithPreload(() => import('../apps/virtual-date/App').then(module => ({ default: module.VirtualDateSurprise }))),
    customizer: lazyWithPreload(() => import('../apps/virtual-date/components/VirtualDateCustomizer')),
    control: lazyWithPreload(() => import('../apps/virtual-date/components/VirtualDateControl'))
  },
  'valentine': {
    view: lazyWithPreload(() => import('../apps/valentine/App')),
    customizer: lazyWithPreload(() => import('../apps/valentine/component/ValentineCustomizer')),
    control: lazyWithPreload(() => import('../apps/valentine/component/ValentineControl'))
  },
  'proposal': {
    view: lazyWithPreload(() => import('../apps/proposal/ProposalSurprise')),
    customizer: lazyWithPreload(() => import('../apps/proposal/components/ProposalCustomizer')),
    control: lazyWithPreload(() => import('../apps/proposal/components/ProposalControl'))
  },
  'wedding-invitation': {
    view: lazyWithPreload(() => import('../apps/proposal/ProposalSurprise')),
    customizer: lazyWithPreload(() => import('../apps/proposal/components/ProposalCustomizer')),
    control: lazyWithPreload(() => import('../apps/proposal/components/ProposalControl'))
  },
  'wedding-surprise': {
    view: lazyWithPreload(() => import('../apps/proposal/ProposalSurprise')),
    customizer: lazyWithPreload(() => import('../apps/proposal/components/ProposalCustomizer')),
    control: lazyWithPreload(() => import('../apps/proposal/components/ProposalControl'))
  },
  'new-year': {
    view: lazyWithPreload(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazyWithPreload(() => import('../apps/birthday/components/BirthdayCustomizer')),
    control: lazyWithPreload(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'best-friend': {
    view: lazyWithPreload(() => import('../apps/valentine/App')),
    customizer: lazyWithPreload(() => import('../apps/valentine/component/ValentineCustomizer')),
    control: lazyWithPreload(() => import('../apps/valentine/component/ValentineControl'))
  },
  'friendship-day': {
    view: lazyWithPreload(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazyWithPreload(() => import('../apps/birthday/components/BirthdayCustomizer')),
    control: lazyWithPreload(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'random-day': {
    view: lazyWithPreload(() => import('../apps/virtual-date/App').then(module => ({ default: module.VirtualDateSurprise }))),
    customizer: lazyWithPreload(() => import('../apps/virtual-date/components/VirtualDateCustomizer')),
    control: lazyWithPreload(() => import('../apps/virtual-date/components/VirtualDateControl'))
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
