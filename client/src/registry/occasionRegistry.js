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
  }
};

/**
 * Utility helper to extract a clean registry slug key matching the database slug
 * @param {string} slug 
 * @returns {string|null}
 */
export function getOccasionKey(slug) {
  if (!slug) return null;
  const lowercase = slug.toLowerCase();
  if (lowercase.includes('birthday')) return 'birthday';
  if (lowercase.includes('virtual-date') || lowercase.includes('virtual date')) return 'virtual-date';
  if (lowercase.includes('valentine')) return 'valentine';
  if (lowercase.includes('proposal')) return 'proposal';
  return null;
}
