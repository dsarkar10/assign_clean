import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, PendingAction, OrderCard, CardItem, colors, typography, spacing } from '@clear-energy/shared';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

export function PendingActionsScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['pending-actions', 'a-201'],
    queryFn: ({ signal }) => api.getPendingActions('a-201', signal),
  });

  const toCardItem = (a: PendingAction): CardItem => {
    let tagVariant: CardItem['tagVariant'] = 'default';
    if (a.priority === 'breached') tagVariant = 'error';
    if (a.priority === 'high') tagVariant = 'warning';
    if (a.priority === 'med') tagVariant = 'info';
    if (a.priority === 'low') tagVariant = 'success';

    const age = a.ageMinutes >= 60
      ? `${Math.floor(a.ageMinutes / 60)}h ${a.ageMinutes % 60}m`
      : `${a.ageMinutes}m`;
    const sla = a.slaMinutes ? ` · SLA ${a.slaMinutes}m` : '';

    return {
      id: a.id,
      heading: a.category.toUpperCase().replace(/_/g, ' '),
      body: `${a.summary}\nPending ${age}${sla}`,
      cta: a.action ? a.action.toUpperCase() : 'REVIEW',
      tagVariant,
    };
  };

  const dismiss = (id: string) => {
    queryClient.setQueryData<PendingAction[]>(['pending-actions', 'a-201'], (prev) => {
      if (!prev) return prev;
      return prev.filter((x) => x.id !== id);
    });
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
        <Text style={styles.error}>Failed to load pending actions.</Text>
        <Pressable style={styles.retry} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </Animated.View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.center}>
        <Text style={styles.emoji}>✅</Text>
        <Text style={styles.emptyTitle}>All caught up!</Text>
        <Text style={styles.emptySub}>No pending actions in your queue right now.</Text>
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
          <Animated.View entering={FadeInDown.delay(index * 60).duration(280)} exiting={FadeOut}>
            <OrderCard mode="queue" data={toCardItem(item)} onAction={() => dismiss(item.id)} />
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
