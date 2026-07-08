import { View, Text, StyleSheet } from "react-native";
import type { OrderCardProps, ActionPriority, OrderStatus } from "../types";
import { formatPrice } from "../utils/format";

const PRIORITY_COLORS: Record<ActionPriority, string> = {
  high: "#DC2626",
  medium: "#F59E0B",
  low: "#6B7280",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  out_for_delivery: "Out for Delivery",
  in_transit: "In Transit",
  delivered: "Delivered",
  failed: "Failed",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#F59E0B",
  out_for_delivery: "#3B82F6",
  in_transit: "#8B5CF6",
  delivered: "#10B981",
  failed: "#DC2626",
};

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: STATUS_COLORS[status] + "20" },
      ]}
    >
      <Text style={[styles.badgeText, { color: STATUS_COLORS[status] }]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

function PriorityChip({ priority }: { priority: ActionPriority }) {
  return (
    <View style={[styles.priorityChip, { backgroundColor: PRIORITY_COLORS[priority] + "20" }]}>
      <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[priority] }]} />
      <Text style={[styles.priorityText, { color: PRIORITY_COLORS[priority] }]}>
        {priority.toUpperCase()}
      </Text>
    </View>
  );
}

function EtaBadge({ eta }: { eta: string }) {
  const time = new Date(eta);
  const formatted = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <View style={styles.etaBadge}>
      <Text style={styles.etaText}>ETA {formatted}</Text>
    </View>
  );
}

function AddressText({ address, truncate }: { address: string; truncate?: boolean }) {
  return (
    <Text style={styles.address} numberOfLines={truncate ? 2 : undefined}>
      {address}
    </Text>
  );
}

function ActionButton() {
  return (
    <View style={styles.actionButton}>
      <Text style={styles.actionButtonText}>Take Action</Text>
    </View>
  );
}

export function OrderCard(props: OrderCardProps) {
  switch (props.mode) {
    case "customer":
      return (
        <Card>
          <View style={styles.header}>
            <Text style={styles.title}>{props.customerName}</Text>
            <StatusBadge status={props.status} />
          </View>
          <Row label="SKU" value={`${props.sku} x${props.quantity}`} />
          <AddressText address={props.address} />
          <Text style={styles.price}>{formatPrice(props.amountPaise)}</Text>
        </Card>
      );

    case "driver":
      return (
        <Card>
          <View style={styles.header}>
            <Text style={styles.title}>{props.customerName}</Text>
            <EtaBadge eta={props.eta} />
          </View>
          <AddressText address={props.address} truncate />
          <Row label="SKU" value={`${props.sku} x${props.quantity}`} />
          <StatusBadge status={props.status} />
        </Card>
      );

    case "admin":
      return (
        <Card>
          <View style={styles.header}>
            <PriorityChip priority={props.priority} />
            <Text style={styles.actionType}>{props.type.replace(/_/g, " ")}</Text>
          </View>
          <Text style={styles.title}>{props.customerName}</Text>
          <AddressText address={props.address} truncate />
          <Text style={styles.summary}>{props.summary}</Text>
          {props.amountPaise > 0 && (
            <Text style={styles.price}>{formatPrice(props.amountPaise)}</Text>
          )}
          <ActionButton />
        </Card>
      );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginRight: 6,
  },
  value: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },
  address: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#059669",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  priorityChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },
  actionType: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textTransform: "capitalize",
  },
  etaBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  etaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3B82F6",
  },
  summary: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: "#6366F1",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 10,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
