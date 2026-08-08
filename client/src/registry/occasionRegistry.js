import React, { lazy } from 'react';

const lazyWithPreload = (factory) => {
  const Component = lazy(factory);
  Component.preload = factory;
  return Component;
};

export const OccasionRegistry = {
  'birthday-dark': {
    view: lazyWithPreload(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazyWithPreload(() => import('../apps/birthday/components/BirthdayCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/birthday/components/BirthdayDemoConfig')),
    control: lazyWithPreload(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'birthday-pastel': {
    view: lazyWithPreload(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazyWithPreload(() => import('../apps/birthday/components/BirthdayCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/birthday/components/BirthdayDemoConfig')),
    control: lazyWithPreload(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'birthday-pink': {
    view: lazyWithPreload(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazyWithPreload(() => import('../apps/birthday/components/BirthdayCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/birthday/components/BirthdayDemoConfig')),
    control: lazyWithPreload(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'birthday': {
    view: lazyWithPreload(() => import('../apps/birthday/BirthdaySurprise')),
    customizer: lazyWithPreload(() => import('../apps/birthday/components/BirthdayCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/birthday/components/BirthdayDemoConfig')),
    control: lazyWithPreload(() => import('../apps/birthday/components/BirthdayControl'))
  },
  'virtual-date': {
    view: lazyWithPreload(() => import('../apps/virtual-date/App').then(module => ({ default: module.VirtualDateSurprise }))),
    customizer: lazyWithPreload(() => import('../apps/virtual-date/components/VirtualDateCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/virtual-date/components/VirtualDateDemoConfig')),
    control: lazyWithPreload(() => import('../apps/virtual-date/components/VirtualDateControl'))
  },
  'proposal': {
    view: lazyWithPreload(() => import('../apps/proposal/ProposalSurprise')),
    customizer: lazyWithPreload(() => import('../apps/proposal/components/ProposalCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/proposal/components/ProposalDemoConfig')),
    control: lazyWithPreload(() => import('../apps/proposal/components/ProposalControl'))
  },
  'girlfriend-day-dark': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'girlfriend-day-pastel': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'girlfriend-day-pink': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'girlfriend-day': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'girlfriends': {
    view: lazyWithPreload(() => import('../apps/Girlfriends/GirlfriendSurprise')),
    customizer: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Girlfriends/components/GirlfriendControl'))
  },
  'apology-midnight-romance': {
    view: lazyWithPreload(() => import('../apps/Appology/ApologySurprise')),
    customizer: lazyWithPreload(() => import('../apps/Appology/components/ApologyCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Appology/components/ApologyDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Appology/components/ApologyControl'))
  },
  'apology-blush-pink': {
    view: lazyWithPreload(() => import('../apps/Appology/ApologySurprise')),
    customizer: lazyWithPreload(() => import('../apps/Appology/components/ApologyCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Appology/components/ApologyDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Appology/components/ApologyControl'))
  },
  'apology-lavender-dream': {
    view: lazyWithPreload(() => import('../apps/Appology/ApologySurprise')),
    customizer: lazyWithPreload(() => import('../apps/Appology/components/ApologyCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Appology/components/ApologyDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Appology/components/ApologyControl'))
  },
  'apology': {
    view: lazyWithPreload(() => import('../apps/Appology/ApologySurprise')),
    customizer: lazyWithPreload(() => import('../apps/Appology/components/ApologyCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Appology/components/ApologyDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Appology/components/ApologyControl'))
  },
  'apology-surprise': {
    view: lazyWithPreload(() => import('../apps/Appology/ApologySurprise')),
    customizer: lazyWithPreload(() => import('../apps/Appology/components/ApologyCustomizer')),
    demoConfig: lazyWithPreload(() => import('../apps/Appology/components/ApologyDemoConfig')),
    control: lazyWithPreload(() => import('../apps/Appology/components/ApologyControl'))
  }
};

/**
 * Utility helper to extract a clean canonical registry key matching database themeSlug or categorySlug
 * @param {string} slug 
 * @returns {string} Target occasion registry key
 */
export function getOccasionKey(slug) {
  const s = String(slug || '').toLowerCase().trim();
  if (OccasionRegistry[s]) return s;

  // Direct category family mappings
  if (s.includes('birthday')) return 'birthday';
  if (s.includes('girlfriend')) return 'girlfriend-day';
  if (s.includes('proposal')) return 'proposal';
  if (s.includes('virtual-date') || s.includes('valentine')) return 'virtual-date';
  if (s.includes('apology')) return 'apology';

  return s || 'birthday';
}
