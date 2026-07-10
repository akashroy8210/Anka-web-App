import { api } from './api.service';

export const leadService = {
  getLeads: api.getLeads,
  submitLead: api.submitLead,
  updateLeadStatus: api.updateLeadStatus,
  deleteLead: api.deleteLead,
};
