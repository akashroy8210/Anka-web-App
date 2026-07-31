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
  'girlfriend-day-dark': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'girlfriend-day-pastel': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'girlfriend-day-pink': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'girlfriend-day': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'girlfriends': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  }
};

/**
 * Utility helper to extract a clean registry slug key matching the database category or theme slug
 * @param {string} slug 
 * @returns {string} Target occasion registry key
 */
export function getOccasionKey(slug) {
  const s = String(slug || '').toLowerCase().trim();

  // 1. Direct exact match in OccasionRegistry
  if (OccasionRegistry[s]) return s;

  const registeredKeys = Object.keys(OccasionRegistry);

  // 2. Dynamic key matching (clean hyphens/plurals)
  const cleanS = s.replace(/s$/, '');
  const matchedKey = registeredKeys.find(key => {
    const cleanKey = key.replace(/s$/, '');
    return key === cleanS || cleanKey === cleanS || s.includes(key) || key.includes(s) || cleanS.includes(cleanKey) || cleanKey.includes(cleanS);
  });

  if (matchedKey) return matchedKey;

  return s;
}
