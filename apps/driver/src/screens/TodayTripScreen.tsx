import { FlatList, Text, View, StyleSheet } from "react-native";
import { OrderCard } from "@clear/shared";
import type { TripStop, OrderStatus } from "@clear/shared";

const stops: TripStop[] = [
  {
    id: "stop-101",
    orderId: "ord-103",
    customerName: "Priya Sharma",
    address: "15 Banjara Hills, Road No 5, Hyderabad, Telangana 500034",
    sku: "CYL-14.2",
    quantity: 1,
    amountPaise: 123400,
    status: "out_for_delivery" as OrderStatus,
    eta: "2026-07-08T10:30:00Z",
    sortOrder: 1,
  },
  {
    id: "stop-102",
    orderId: "ord-104",
    customerName: "Priya Sharma",
    address: "15 Banjara Hills, Road No 5, Hyderabad, Telangana 500034",
    sku: "CYL-5",
    quantity: 3,
    amountPaise: 295200,
    status: "pending" as OrderStatus,
    eta: "2026-07-08T11:15:00Z",
    sortOrder: 2,
  },
  {
    id: "stop-103",
    orderId: "ord-105",
    customerName: "Amit Singh",
    address: "8A Film Nagar, Hyderabad, Telangana 500096",
    sku: "CYL-14.2",
    quantity: 2,
    amountPaise: 246800,
    status: "pending" as OrderStatus,
    eta: "2026-07-08T12:00:00Z",
    sortOrder: 3,
  },
  {
    id: "stop-104",
    orderId: "ord-101",
    customerName: "Rajesh Kumar",
    address: "42 Jubilee Hills, Road No 10, Hyderabad, Telangana 500033",
    sku: "CYL-14.2",
    quantity: 2,
    amountPaise: 246800,
    status: "delivered" as OrderStatus,
    eta: "2026-07-08T09:00:00Z",
    sortOrder: 4,
  },
];

export function TodayTripScreen() {
  return (
    <FlatList
      data={stops}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => (
        <View>
          <View style={styles.stopHeader}>
            <View style={styles.stopDot} />
            <Text style={styles.stopLabel}>Stop {index + 1}</Text>
          </View>
          <OrderCard
            mode="driver"
            customerName={item.customerName}
            address={item.address}
            eta={item.eta}
            status={item.status}
            sku={item.sku}
            quantity={item.quantity}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
  },
  stopHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 24,
    marginBottom: 4,
    marginTop: 8,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
    marginRight: 8,
  },
  stopLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
