import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { endpoints, Order, OrderCard, OrderCardData, colors, typography, spacing } from '@clear-energy/shared';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

export function TodaysOrdersScreen() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders', 'c-001'],
    queryFn: ({ signal }) => endpoints.getOrders('c-001', signal),
  });

  const mapToCardData = (order: Order): OrderCardData => {
    let statusColorType: OrderCardData['statusColorType'] = 'default';
    if (order.status === 'delivered') statusColorType = 'success';
    if (order.status === 'cancelled' || order.status === 'returned') statusColorType = 'error';
    if (order.status === 'out_for_delivery') statusColorType = 'info';
    if (order.status === 'placed' || order.status === 'assigned') statusColorType = 'warning';

    return {
      id: order.id,
      title: order.sku.name,
      subtitle: `${order.address}`,
      amountPaise: order.amountPaise,
      statusLabel: order.status.replace(/_/g, ' ').toUpperCase(),
      statusColorType,
    };
  };

  if (isLoading) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </Animated.View>
    );
  }

  if (isError) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load orders.</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </Animated.View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🛍️</Text>
        <Text style={styles.emptyTitle}>No orders yet today</Text>
        <Text style={styles.emptySubtext}>Orders placed today will appear here.</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => refetch()}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).duration(280)}>
            <OrderCard variant="customer" data={mapToCardData(item)} />
          </Animated.View>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  listContent: {
    padding: spacing.md,
  },
  errorText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.base,
    color: colors.error,
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.pillActive,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  retryText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.base,
    color: colors.pillActiveText,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
