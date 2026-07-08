import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, PendingAction, OrderCard, OrderCardData, colors, typography, spacing } from '@clear-energy/shared';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

export function PendingActionsScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['pending-actions', 'a-201'],
    queryFn: ({ signal }) => endpoints.getPendingActions('a-201', signal),
  });

  const mapToCardData = (action: PendingAction): OrderCardData => {
    let statusColorType: OrderCardData['statusColorType'] = 'default';
    if (action.priority === 'breached') statusColorType = 'error';
    if (action.priority === 'high') statusColorType = 'warning';
    if (action.priority === 'med') statusColorType = 'info';
    if (action.priority === 'low') statusColorType = 'success';

    const ageStr = action.ageMinutes >= 60
      ? `${Math.floor(action.ageMinutes / 60)}h ${action.ageMinutes % 60}m`
      : `${action.ageMinutes}m`;
    const slaStr = action.slaMinutes
      ? ` · SLA ${action.slaMinutes}m`
      : '';
    const ageLine = `Pending ${ageStr}${slaStr}`;

    return {
      id: action.id,
      title: action.category.toUpperCase().replace(/_/g, ' '),
      subtitle: `${action.summary}\n${ageLine}`,
      actionLabel: action.action ? action.action.toUpperCase() : 'REVIEW',
      statusColorType,
    };
  };

  const handleAction = (id: string) => {
    console.log(`Action handled for ${id}`);
    queryClient.setQueryData<PendingAction[]>(['pending-actions', 'a-201'], (oldData) => {
      if (!oldData) return oldData;
      return oldData.filter((action) => action.id !== id);
    });
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
        <Text style={styles.errorText}>Failed to load pending actions.</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </Animated.View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>✅</Text>
        <Text style={styles.emptyTitle}>All caught up!</Text>
        <Text style={styles.emptySubtext}>No pending actions in your queue right now.</Text>
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
          <Animated.View entering={FadeInDown.delay(index * 60).duration(280)} exiting={FadeOut}>
            <OrderCard
              variant="admin"
              data={mapToCardData(item)}
              onActionPress={() => handleAction(item.id)}
            />
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
