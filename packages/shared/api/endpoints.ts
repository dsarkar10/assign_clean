import { apiClient } from './client';
import { Order, TripStop, PendingAction } from '../types/order';

export const endpoints = {
  getOrders: (customerId: string, signal?: AbortSignal) => 
    apiClient<Order[]>(`/orders?customerId=${customerId}`, { signal }),
    
  getTrip: (driverId: string, signal?: AbortSignal) => 
    apiClient<TripStop[]>(`/trips?driverId=${driverId}`, { signal }),
    
  getPendingActions: (adminId: string, signal?: AbortSignal) => 
    apiClient<PendingAction[]>(`/pending-actions?adminId=${adminId}`, { signal }),
};
