import { useState } from 'react';
import { orderService } from '../services/order.service';

export function useOrders(initialInstances) {
  const [instances, setInstances] = useState(initialInstances || []);

  const handleDeleteInstance = async (id, token) => {
    if (!window.confirm('Permanently delete this surprise order?')) return;
    try {
      const res = await orderService.deleteInstance(id, token);
      if (res.success) {
        setInstances(instances.filter(inst => inst._id !== id));
      }
    } catch (err) {
      alert('Error deleting order');
    }
  };

  const handleImpersonate = (instanceId, token, navigate) => {
    localStorage.setItem('customerToken', token);
    localStorage.setItem('instanceId', instanceId);
    navigate(`/customizer/${instanceId}`);
  };

  return {
    instances,
    setInstances,
    handleDeleteInstance,
    handleImpersonate,
  };
}
