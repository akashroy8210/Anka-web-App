import BirthdaySurprise from '../apps/birthday/BirthdaySurprise';
import { VirtualDateSurprise } from '../apps/virtual-date/App';
import ValentineWeekSurprise from '../apps/valentine/App';
import ProposalSurprise from '../apps/proposal/ProposalSurprise';

import BirthdayCustomizer from '../apps/birthday/components/BirthdayCustomizer';
import VirtualDateCustomizer from '../apps/virtual-date/components/VirtualDateCustomizer';
import ValentineCustomizer from '../apps/valentine/component/ValentineCustomizer';
import ProposalCustomizer from '../apps/proposal/components/ProposalCustomizer';

import BirthdayControl from '../apps/birthday/components/BirthdayControl';
import VirtualDateControl from '../apps/virtual-date/components/VirtualDateControl';
import ValentineControl from '../apps/valentine/component/ValentineControl';
import ProposalControl from '../apps/proposal/components/ProposalControl';

export const OccasionRegistry = {
  'birthday': {
    view: BirthdaySurprise,
    customizer: BirthdayCustomizer,
    control: BirthdayControl
  },
  'virtual-date': {
    view: VirtualDateSurprise,
    customizer: VirtualDateCustomizer,
    control: VirtualDateControl
  },
  'valentine': {
    view: ValentineWeekSurprise,
    customizer: ValentineCustomizer,
    control: ValentineControl
  },
  'proposal': {
    view: ProposalSurprise,
    customizer: ProposalCustomizer,
    control: ProposalControl
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
