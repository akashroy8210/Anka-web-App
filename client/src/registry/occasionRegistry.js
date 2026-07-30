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
  }
};

/**
 * Utility helper to extract a clean registry slug key matching the database category or theme slug
 * @param {string} slug 
 * @returns {string} Target occasion registry key
 */
export function getOccasionKey(slug) {
  const s = String(slug || '').toLowerCase().trim();
  const registeredKeys = Object.keys(OccasionRegistry);

  // 1. Direct exact match in OccasionRegistry
  if (OccasionRegistry[s]) return s;

  // 2. Dynamic partial match against registered keys
  const matchedKey = registeredKeys.find(key => s.includes(key) || key.includes(s));
  if (matchedKey) return matchedKey;

  // 3. Dynamically return the primary registered occasion key
  return registeredKeys[0] || s;
}
