import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function StatCard({ label, value, icon, style }: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  label: { 
    fontFamily: typography.fontFamily.body, 
    fontSize: typography.size.sm, 
    color: colors.textSecondary 
  },
  value: { 
    fontFamily: typography.fontFamily.mono, 
    fontSize: typography.size.xl, 
    color: colors.textPrimary, 
    marginTop: spacing.sm 
  },
});
