export type OrderStatus =
  | "pending"
  | "out_for_delivery"
  | "in_transit"
  | "delivered"
  | "failed";

export type ActionPriority = "high" | "medium" | "low";

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  address: string;
  sku: string;
  quantity: number;
  amountPaise: number;
  status: OrderStatus;
  createdAt: string;
};

export type TripStop = {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  sku: string;
  quantity: number;
  amountPaise: number;
  status: OrderStatus;
  eta: string;
  sortOrder: number;
};

export type Trip = {
  id: string;
  driverId: string;
  date: string;
  stops: TripStop[];
};

export type PendingAction = {
  id: string;
  adminId: string;
  orderId: string;
  type: string;
  priority: ActionPriority;
  customerName: string;
  address: string;
  sku: string;
  amountPaise: number;
  summary: string;
  flaggedAt: string;
};

export type OrderCardMode = "customer" | "driver" | "admin";

export type OrderCardCustomerProps = {
  mode: "customer";
  customerName: string;
  address: string;
  status: OrderStatus;
  sku: string;
  quantity: number;
  amountPaise: number;
};

export type OrderCardDriverProps = {
  mode: "driver";
  customerName: string;
  address: string;
  eta: string;
  status: OrderStatus;
  sku: string;
  quantity: number;
};

export type OrderCardAdminProps = {
  mode: "admin";
  customerName: string;
  address: string;
  priority: ActionPriority;
  type: string;
  summary: string;
  amountPaise: number;
};

export type OrderCardProps =
  | OrderCardCustomerProps
  | OrderCardDriverProps
  | OrderCardAdminProps;
