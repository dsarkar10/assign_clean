import { ApiError } from '../types/api';
import { Order, TripStop, PendingAction } from '../types/order';

const BASE_URL = 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  idempotencyKey?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { idempotencyKey, headers: customHeaders, ...restOptions } = options;
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/json');
  if (idempotencyKey) {
    headers.set('X-Idempotency-Key', idempotencyKey);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...restOptions,
      headers,
    });
    if (!response.ok) {
      throw { status: response.status, message: `HTTP Error: ${response.status} ${response.statusText}` } as ApiError;
    }
    return response.json() as Promise<T>;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted:', endpoint);
      throw error;
    }
    if (error.status) throw error;
    throw { message: 'Network Error', cause: error } as ApiError;
  }
}

export const api = {
  getOrders: (customerId: string, signal?: AbortSignal) =>
    apiFetch<Order[]>(`/orders?customerId=${customerId}`, { signal }),
  getTrip: (driverId: string, signal?: AbortSignal) =>
    apiFetch<TripStop[]>(`/trips?driverId=${driverId}`, { signal }),
  getPendingActions: (adminId: string, signal?: AbortSignal) =>
    apiFetch<PendingAction[]>(`/pending-actions?adminId=${adminId}`, { signal }),
};
