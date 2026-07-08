import { FlatList, Text, View, StyleSheet } from "react-native";
import { OrderCard, formatPrice } from "@clear/shared";
import type { PendingAction, ActionPriority } from "@clear/shared";

const data: PendingAction[] = [
  {
    id: "action-101",
    adminId: "admin-1",
    orderId: "ord-106",
    type: "payment_failed",
    priority: "high" as ActionPriority,
    customerName: "Amit Singh",
    address: "8A Film Nagar, Hyderabad",
    sku: "CYL-5",
    amountPaise: 98400,
    summary: "Payment failed after 3 retries — card declined",
    flaggedAt: "2026-07-08T09:15:00Z",
  },
  {
    id: "action-102",
    adminId: "admin-1",
    orderId: "ord-104",
    type: "address_conflict",
    priority: "high" as ActionPriority,
    customerName: "Priya Sharma",
    address: "15 Banjara Hills, Road No 5, Hyderabad",
    sku: "CYL-5",
    amountPaise: 295200,
    summary: "Customer reported wrong address on file — needs verification",
    flaggedAt: "2026-07-08T08:30:00Z",
  },
  {
    id: "action-103",
    adminId: "admin-1",
    orderId: "trip-1",
    type: "delay_report",
    priority: "medium" as ActionPriority,
    customerName: "Priya Sharma",
    address: "15 Banjara Hills, Road No 5, Hyderabad",
    sku: "",
    amountPaise: 0,
    summary: "Driver #1 reported 20 min delay due to traffic on Banjara Hills route",
    flaggedAt: "2026-07-08T10:05:00Z",
  },
  {
    id: "action-104",
    adminId: "admin-1",
    orderId: "ord-107",
    type: "refund_request",
    priority: "medium" as ActionPriority,
    customerName: "Amit Singh",
    address: "8A Film Nagar, Hyderabad",
    sku: "CYL-14.2",
    amountPaise: 123400,
    summary: "Customer requested refund — claims cylinder weight below standard",
    flaggedAt: "2026-07-08T07:45:00Z",
  },
  {
    id: "action-105",
    adminId: "admin-1",
    orderId: "driver-2",
    type: "compliance_check",
    priority: "low" as ActionPriority,
    customerName: "Driver #2 — Sunita route",
    address: "Himayat Nagar, Hyderabad",
    sku: "",
    amountPaise: 0,
    summary: "Monthly safety certification due for driver assigned to Trip #2",
    flaggedAt: "2026-07-08T06:00:00Z",
  },
  {
    id: "action-106",
    adminId: "admin-1",
    orderId: "inv-001",
    type: "inventory_shortage",
    priority: "low" as ActionPriority,
    customerName: "Warehouse — Jubilee Hills",
    address: "42 Jubilee Hills, Hyderabad",
    sku: "CYL-14.2",
    amountPaise: 0,
    summary: "Stock below threshold — only 12 cylinders remaining (reorder at 20)",
    flaggedAt: "2026-07-07T16:00:00Z",
  },
];

export function PendingActionsScreen() {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <OrderCard
          mode="admin"
          customerName={item.customerName}
          address={item.address}
          priority={item.priority}
          type={item.type}
          summary={item.summary}
          amountPaise={item.amountPaise}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
});
