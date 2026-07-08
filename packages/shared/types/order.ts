export type OrderStatus = 'placed' | 'assigned' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';

export interface SKU {
  code: string;
  name: string;
  qty?: number;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  amountPaise: number;
  sku: SKU;
  status: OrderStatus;
  placedAt: string;
  eta?: string | null;
}

export type TripStopStatus = 'pending' | 'active' | 'done' | 'skipped';

export interface TripStop {
  seq: number;
  orderId: string;
  customerName: string;
  sku: string;
  address: string;
  distanceKm: number;
  status: TripStopStatus;
  etaMin?: number | null;
}

export type PendingActionCategory = 'mi_empty' | 'mi_full' | 'cash' | 'prior_delivery' | 'unassigned' | 'verification' | 'branch_assign' | 'kyc';
export type PendingActionPriority = 'low' | 'med' | 'high' | 'breached';
export type PendingActionType = 'approve' | 'route' | 'decide' | 'assign' | 'remind' | 'review';

export interface PendingAction {
  id: string;
  category: PendingActionCategory;
  summary: string;
  priority: PendingActionPriority;
  ageMinutes: number;
  slaMinutes?: number;
  action?: PendingActionType;
}

export interface OrderCardData {
  id: string;
  title: string;
  subtitle?: string;
  amountPaise?: number;
  seqLabel?: string;
  statusLabel?: string;
  statusColorType?: 'success' | 'warning' | 'error' | 'info' | 'default';
  actionLabel?: string;
}
