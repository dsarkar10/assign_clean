import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api, Order, OrderCard, CardItem, colors, typography, spacing } from '@clear-energy/shared';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

export function TodaysOrdersScreen() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders', 'c-001'],
    queryFn: ({ signal }) => api.getOrders('c-001', signal),
  });

  const toCardItem = (order: Order): CardItem => {
    let tagVariant: CardItem['tagVariant'] = 'default';
    if (order.status === 'delivered') tagVariant = 'success';
    if (order.status === 'cancelled' || order.status === 'returned') tagVariant = 'error';
    if (order.status === 'out_for_delivery') tagVariant = 'info';
    if (order.status === 'placed' || order.status === 'assigned') tagVariant = 'warning';

    return {
      id: order.id,
      heading: order.sku.name,
      body: order.address,
      value: order.amountPaise,
      tag: order.status.replace(/_/g, ' ').toUpperCase(),
      tagVariant,
    };
  };

  if (isLoading) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </Animated.View>
    );
  }

  if (isError) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.center}>
        <Text style={styles.error}>Failed to load orders.</Text>
        <Pressable style={styles.retry} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </Animated.View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.center}>
        <Text style={styles.emoji}>🛍️</Text>
        <Text style={styles.emptyTitle}>No orders yet today</Text>
        <Text style={styles.emptySub}>Orders placed today will appear here.</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refetch()} tintColor={colors.accent} colors={[colors.accent]} />
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).duration(280)}>
            <OrderCard mode="order" data={toCardItem(item)} />
          </Animated.View>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  list: { padding: spacing.md },
  error: { fontFamily: typography.fontFamily.body, fontSize: typography.size.base, color: colors.error, marginBottom: spacing.md },
  retry: { backgroundColor: colors.pillActive, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 999 },
  retryText: { fontFamily: typography.fontFamily.bodyMedium, fontSize: typography.size.base, color: colors.pillActiveText },
  emoji: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: { fontFamily: typography.fontFamily.bodyMedium, fontSize: typography.size.lg, color: colors.textPrimary, marginBottom: spacing.xs },
  emptySub: { fontFamily: typography.fontFamily.body, fontSize: typography.size.sm, color: colors.textSecondary, textAlign: 'center' },
});
