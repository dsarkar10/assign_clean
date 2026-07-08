import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { OrderCardData } from '../types/order';
import { colors, spacing, radius, typography } from '../theme/tokens';
import { formatPaiseToINR } from '../utils/formatPrice';

export interface OrderCardProps {
  variant: 'customer' | 'driver' | 'admin';
  data: OrderCardData;
  onActionPress?: () => void;
  onStartTripPress?: () => void;
}

function PulsingPill({ label, color }: { label: string; color: string }) {
  const opacity = useSharedValue(1);
  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.5, { duration: 800 }),
      -1,
      true
    );
  }, []);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }), [opacity]);
  return (
    <Animated.View style={[styles.pill, { backgroundColor: color }, animStyle]}>
      <Text style={styles.pillText}>{label}</Text>
    </Animated.View>
  );
}

export function OrderCard({ variant, data, onActionPress, onStartTripPress }: OrderCardProps) {
  const statusColorMap = {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    default: colors.textMuted,
  };
  const statusColor = statusColorMap[data.statusColorType ?? 'default'];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imagePlaceholder}>
        <LinearGradient
          colors={colors.scrimGradient}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 1 }}
        />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            {variant === 'driver' && data.seqLabel != null && (
              <View style={styles.seqBadge}>
                <Text style={styles.seqText}>{data.seqLabel}</Text>
              </View>
            )}
            <Text style={styles.title} numberOfLines={1}>{data.title}</Text>
          </View>

          {data.subtitle && (
            <Text style={styles.subtitle} numberOfLines={2}>{data.subtitle}</Text>
          )}

          {variant === 'customer' && data.amountPaise != null && (
            <Text style={styles.price}>{formatPaiseToINR(data.amountPaise)}</Text>
          )}

          <View style={styles.footerRow}>
            {variant === 'customer' && data.statusLabel && (
              <View style={[styles.pill, { backgroundColor: statusColor }]}>
                <Text style={styles.pillText}>{data.statusLabel}</Text>
              </View>
            )}

            {variant === 'driver' && (
              <View style={styles.driverActions}>
                {data.statusLabel && (
                  <View style={[styles.etaBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.etaText}>ETA</Text>
                    <Text style={styles.etaValue}>{data.statusLabel}</Text>
                  </View>
                )}
                {data.statusColorType !== 'success' && (
                  <Pressable style={styles.startTripButton} onPress={onStartTripPress}>
                    <Text style={styles.startTripText}>
                      {data.statusColorType === 'info' ? 'Complete Trip' : 'Start Trip'}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {variant === 'admin' && data.actionLabel && (
              data.statusColorType === 'error' ? (
                <PulsingPill label={data.actionLabel} color={statusColor} />
              ) : (
                <Pressable
                  style={[styles.pill, { backgroundColor: statusColor }]}
                  onPress={onActionPress}
                >
                  <Text style={styles.pillText}>{data.actionLabel}</Text>
                </Pressable>
              )
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    minHeight: 140,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#1E1E24',
    justifyContent: 'flex-end',
  },
  content: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  seqBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seqText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.xs,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  title: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    flex: 1,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  price: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.base,
    color: colors.success,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: spacing.xs,
  },
  driverActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  etaBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignItems: 'center',
    minWidth: 64,
  },
  etaText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.bg,
    letterSpacing: 1,
    opacity: 0.7,
  },
  etaValue: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.sm,
    color: colors.bg,
    fontWeight: 'bold',
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  pillText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.xs,
    color: colors.bg,
    fontWeight: 'bold',
  },
  startTripButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  startTripText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.textPrimary,
  },
});
