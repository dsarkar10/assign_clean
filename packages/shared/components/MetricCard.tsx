import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

interface MetricCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function MetricCard({ label, value, icon, style }: MetricCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.lbl}>{label}</Text>
        {icon}
      </View>
      <Text style={styles.val}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lbl: { fontFamily: typography.fontFamily.body, fontSize: typography.size.sm, color: colors.textSecondary },
  val: { fontFamily: typography.fontFamily.mono, fontSize: typography.size.xl, color: colors.textPrimary, marginTop: spacing.sm },
});
