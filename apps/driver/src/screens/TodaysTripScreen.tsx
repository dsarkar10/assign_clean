import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, TripStop, OrderCard, CardItem, colors, typography, spacing, radius } from '@clear-energy/shared';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

export function TodaysTripScreen() {
  const [tab, setTab] = useState<'list' | 'map'>('list');
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trip', 'd-101'],
    queryFn: ({ signal }) => api.getTrip('d-101', signal),
  });

  const toCardItem = (stop: TripStop): CardItem => {
    let tagVariant: CardItem['tagVariant'] = 'default';
    if (stop.status === 'done') tagVariant = 'success';
    if (stop.status === 'skipped') tagVariant = 'error';
    if (stop.status === 'active') tagVariant = 'info';
    if (stop.status === 'pending') tagVariant = 'warning';

    return {
      id: stop.orderId,
      heading: stop.customerName,
      body: `${stop.address} • ${stop.sku}`,
      badge: String(stop.seq),
      tag: stop.etaMin ? `${stop.etaMin} min` : stop.status.toUpperCase(),
      tagVariant,
    };
  };

  const advanceStop = (id: string) => {
    queryClient.setQueryData<TripStop[]>(['trip', 'd-101'], (prev) => {
      if (!prev) return prev;
      return prev.map((s) => {
        if (s.orderId === id) {
          const next: TripStop['status'] = s.status === 'pending' ? 'active' : 'done';
          return { ...s, status: next };
        }
        return s;
      });
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
        <Text style={styles.error}>Failed to load trip stops.</Text>
        <Pressable style={styles.retry} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <View style={styles.tabs}>
        <Pressable style={[styles.tab, tab === 'list' && styles.tabActive]} onPress={() => setTab('list')}>
          <Text style={[styles.tabLabel, tab === 'list' && styles.tabLabelActive]}>List</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === 'map' && styles.tabActive]} onPress={() => setTab('map')}>
          <Text style={[styles.tabLabel, tab === 'map' && styles.tabLabelActive]}>Map</Text>
        </Pressable>
      </View>
      {tab === 'map' ? (
        <View style={styles.center}>
          <Text style={styles.emptySub}>Map view placeholder</Text>
        </View>
      ) : (!data || data.length === 0) ? (
        <View style={styles.center}>
          <Text style={styles.emoji}>🗳️</Text>
          <Text style={styles.emptyTitle}>No stops assigned</Text>
          <Text style={styles.emptySub}>Your route will appear here once assigned.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => refetch()} tintColor={colors.accent} colors={[colors.accent]} />
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(280)}>
              <OrderCard mode="route" data={toCardItem(item)} onTrip={() => advanceStop(item.orderId)} />
            </Animated.View>
          )}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.bgCardElevated,
    margin: spacing.md,
    borderRadius: radius.pill,
    padding: 2,
  },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.pillActive },
  tabLabel: { fontFamily: typography.fontFamily.bodyMedium, fontSize: typography.size.sm, color: colors.textSecondary },
  tabLabelActive: { color: colors.pillActiveText },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  error: { fontFamily: typography.fontFamily.body, fontSize: typography.size.base, color: colors.error, marginBottom: spacing.md },
  retry: { backgroundColor: colors.pillActive, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 999 },
  retryText: { fontFamily: typography.fontFamily.bodyMedium, fontSize: typography.size.base, color: colors.pillActiveText },
  emoji: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: { fontFamily: typography.fontFamily.bodyMedium, fontSize: typography.size.lg, color: colors.textPrimary, marginBottom: spacing.xs },
  emptySub: { fontFamily: typography.fontFamily.body, fontSize: typography.size.sm, color: colors.textSecondary, textAlign: 'center' },
});
