import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { theme } from "../../constants/theme";

interface GlassCardProps extends ViewProps {
  intensity?: number;
}

export function GlassCard({
  children,
  style,
  intensity = 20,
  ...rest
}: GlassCardProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      <BlurView
        intensity={intensity}
        style={StyleSheet.absoluteFill}
        tint="dark"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
  },
  content: {
    padding: 16,
  },
});
