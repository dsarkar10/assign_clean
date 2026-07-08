import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { CardItem } from '../types/order';
import { colors, spacing, radius, typography } from '../theme/tokens';
import { toINR } from '../utils/formatPrice';

export interface OrderCardProps {
  mode: 'order' | 'route' | 'queue';
  data: CardItem;
  onAction?: () => void;
  onTrip?: () => void;
}

function PulseBadge({ label, color }: { label: string; color: string }) {
  const opacity = useSharedValue(1);
  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(0.5, { duration: 800 }), -1, true);
  }, []);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }), [opacity]);
  return (
    <Animated.View style={[styles.badge, { backgroundColor: color }, animStyle]}>
      <Text style={styles.badgeText}>{label}</Text>
    </Animated.View>
  );
}

export function OrderCard({ mode, data, onAction, onTrip }: OrderCardProps) {
  const colorMap = {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    default: colors.textMuted,
  };
  const chipColor = colorMap[data.tagVariant ?? 'default'];

  return (
    <View style={styles.card}>
      <View style={styles.backdrop}>
        <LinearGradient
          colors={colors.scrimGradient}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.inner}>
          <View style={styles.headRow}>
            {mode === 'route' && data.badge != null && (
              <View style={styles.seqCircle}>
                <Text style={styles.seqNum}>{data.badge}</Text>
              </View>
            )}
            <Text style={styles.heading} numberOfLines={1}>{data.heading}</Text>
          </View>
          {data.body && <Text style={styles.body} numberOfLines={2}>{data.body}</Text>}
          {mode === 'order' && data.value != null && (
            <Text style={styles.price}>{toINR(data.value)}</Text>
          )}
          <View style={styles.footer}>
            {mode === 'order' && data.tag && (
              <View style={[styles.badge, { backgroundColor: chipColor }]}>
                <Text style={styles.badgeText}>{data.tag}</Text>
              </View>
            )}
            {mode === 'route' && (
              <View style={styles.routeRow}>
                {data.tag && (
                  <View style={[styles.etaBox, { backgroundColor: chipColor }]}>
                    <Text style={styles.etaLbl}>ETA</Text>
                    <Text style={styles.etaVal}>{data.tag}</Text>
                  </View>
                )}
                {data.tagVariant !== 'success' && (
                  <Pressable style={styles.ctaBtn} onPress={onTrip}>
                    <Text style={styles.ctaText}>
                      {data.tagVariant === 'info' ? 'Complete Trip' : 'Start Trip'}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
            {mode === 'queue' && data.cta && (
              data.tagVariant === 'error' ? (
                <PulseBadge label={data.cta} color={chipColor} />
              ) : (
                <Pressable style={[styles.badge, { backgroundColor: chipColor }]} onPress={onAction}>
                  <Text style={styles.badgeText}>{data.cta}</Text>
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
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    minHeight: 140,
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#1E1E24',
    justifyContent: 'flex-end',
  },
  inner: { padding: spacing.md },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  seqCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seqNum: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.xs,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  heading: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    flex: 1,
  },
  body: {
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: spacing.xs,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  etaBox: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignItems: 'center',
    minWidth: 64,
  },
  etaLbl: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.bg,
    letterSpacing: 1,
    opacity: 0.7,
  },
  etaVal: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.sm,
    color: colors.bg,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.xs,
    color: colors.bg,
    fontWeight: 'bold',
  },
  ctaBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  ctaText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.size.sm,
    color: colors.textPrimary,
  },
});
