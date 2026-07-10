import { api } from './api.service';

export const orderService = {
  getAllInstances: api.getAllInstances,
  getLiveInstance: api.getLiveInstance,
  getInstanceDetails: api.getInstanceDetails,
  adminCreateInstance: api.adminCreateInstance,
  updateInstanceConfig: api.updateInstanceConfig,
  updateInstanceTier: api.updateInstanceTier,
  deleteInstance: api.deleteInstance,
};
