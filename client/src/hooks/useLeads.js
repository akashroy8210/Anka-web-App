import { useState } from 'react';
import { leadService } from '../services/lead.service';

export function useLeads(initialLeads) {
  const [leads, setLeads] = useState(initialLeads || []);

  const handleUpdateLeadStatus = async (id, statusVal, token) => {
    try {
      const res = await leadService.updateLeadStatus(id, statusVal, token);
      if (res.success) {
        setLeads(leads.map(l => l._id === id ? { ...l, status: res.lead.status } : l));
      } else {
        alert(res.message || 'Error updating status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDeleteLead = async (id, token) => {
    if (!window.confirm('Delete this custom idea inquiry?')) return;
    try {
      const res = await leadService.deleteLead(id, token);
      if (res.success) {
        setLeads(leads.filter(l => l._id !== id));
      }
    } catch (err) {
      alert('Error deleting lead');
    }
  };

  return {
    leads,
    setLeads,
    handleUpdateLeadStatus,
    handleDeleteLead,
  };
}
