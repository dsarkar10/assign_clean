import { FlatList, Text, View, StyleSheet } from "react-native";
import { OrderCard } from "@clear/shared";
import type { Order, OrderStatus } from "@clear/shared";

const data: Order[] = [
  {
    id: "ord-101",
    customerId: "cust-1",
    customerName: "Rajesh Kumar",
    address: "42 Jubilee Hills, Road No 10, Hyderabad",
    sku: "CYL-14.2",
    quantity: 2,
    amountPaise: 246800,
    status: "delivered" as OrderStatus,
    createdAt: "2026-07-08T06:00:00Z",
  },
  {
    id: "ord-102",
    customerId: "cust-1",
    customerName: "Rajesh Kumar",
    address: "42 Jubilee Hills, Road No 10, Hyderabad",
    sku: "CYL-5",
    quantity: 1,
    amountPaise: 98400,
    status: "delivered" as OrderStatus,
    createdAt: "2026-07-01T08:30:00Z",
  },
];

export function TodayOrdersScreen() {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <OrderCard
          mode="customer"
          customerName={item.customerName}
          address={item.address}
          status={item.status}
          sku={item.sku}
          quantity={item.quantity}
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
