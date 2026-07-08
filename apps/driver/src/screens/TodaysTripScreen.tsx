import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, TripStop, OrderCard, OrderCardData, colors, typography, spacing, radius } from '@clear-energy/shared';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

export function TodaysTripScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trip', 'd-101'],
    queryFn: ({ signal }) => endpoints.getTrip('d-101', signal),
  });

  const mapToCardData = (stop: TripStop): OrderCardData => {
    let statusColorType: OrderCardData['statusColorType'] = 'default';
    if (stop.status === 'done') statusColorType = 'success';
    if (stop.status === 'skipped') statusColorType = 'error';
    if (stop.status === 'active') statusColorType = 'info';
    if (stop.status === 'pending') statusColorType = 'warning';

    return {
      id: stop.orderId,
      title: stop.customerName,
      subtitle: `${stop.address} • ${stop.sku}`,
      seqLabel: String(stop.seq),
      statusLabel: stop.etaMin ? `${stop.etaMin} min` : stop.status.toUpperCase(),
      statusColorType,
    };
  };

  const handleStartTrip = (id: string) => {
    console.log(`Starting trip for ${id}`);
    queryClient.setQueryData<TripStop[]>(['trip', 'd-101'], (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((stop) => {
        if (stop.orderId === id) {
          const nextStatus: TripStop['status'] = stop.status === 'pending' ? 'active' : 'done';
          return { ...stop, status: nextStatus };
        }
        return stop;
      });
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
        <Text style={styles.errorText}>Failed to load trip stops.</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <View style={styles.toggleContainer}>
        <Pressable 
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]} 
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>List</Text>
        </Pressable>
        <Pressable 
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]} 
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Map</Text>
        </Pressable>
      </View>

      {viewMode === 'map' ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptySubtext}>Map view placeholder</Text>
        </View>
      ) : (!data || data.length === 0) ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>🗳️</Text>
          <Text style={styles.emptyTitle}>No stops assigned</Text>
          <Text style={styles.emptySubtext}>Your route will appear here once assigned.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.orderId}
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
              <OrderCard
                variant="driver"
                data={mapToCardData(item)}
                onStartTripPress={() => handleStartTrip(item.orderId)}
              />
            </Animated.View>
          )}
        />
      )}
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.bgCardElevated,
    margin: spacing.md,
    borderRadius: radius.pill,
    padding: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  toggleButtonActive: {
    backgroundColor: colors.pillActive,
  },
  toggleText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.pillActiveText,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
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
