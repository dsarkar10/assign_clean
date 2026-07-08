import React from 'react';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/tokens';

interface FrostedButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

export function FrostedButton({ children, onPress, style, size = 44 }: FrostedButtonProps) {
  const r = size / 2;
  return (
    <Pressable onPress={onPress} style={[styles.box, { width: size, height: size, borderRadius: r }, style]}>
      <BlurView intensity={35} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: r }]} />
      <View style={[StyleSheet.absoluteFill, styles.tint, { borderRadius: r }]} />
      <View style={[styles.edge, { borderRadius: r }]} />
      <View style={styles.iconRow}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tint: { backgroundColor: colors.glassFill, zIndex: 1 },
  edge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.glassHighlight,
    zIndex: 2,
  },
  iconRow: { zIndex: 3, alignItems: 'center', justifyContent: 'center' },
});
