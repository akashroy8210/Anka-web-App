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
  'proposal': {
    view: lazyWithPreload(() => import('../apps/proposal/ProposalSurprise')),
    customizer: lazyWithPreload(() => import('../apps/proposal/components/ProposalCustomizer')),
    control: lazyWithPreload(() => import('../apps/proposal/components/ProposalControl'))
  },
  
  
};

/**
 * Utility helper to extract a clean registry slug key matching the database category or theme slug
 * @param {string} slug 
 * @returns {string} Target occasion registry key
 */
export function getOccasionKey(slug) {
  if (!slug) return 'virtual-date';
  const s = String(slug).toLowerCase().trim();

  // 1. Direct exact match in OccasionRegistry
  if (OccasionRegistry[s]) return s;

  // 2. Specific multi-word occasion theme aliases
  if (s.includes('wedding-invitation') || s.includes('invitation')) return 'wedding-invitation';

  // 3. Core primary occasion category keyword aliases
  if (s.includes('proposal') || s.includes('ring') || s.includes('marry')) return 'proposal';
  if (s.includes('valentine') || s.includes('rose') || s.includes('hug') || s.includes('neon-passion')) return 'valentine';
  if (s.includes('birthday') || s.includes('bday') || s.includes('cake')) return 'birthday';

}
