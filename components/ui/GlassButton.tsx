import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { theme } from "../../constants/theme";

interface GlassButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: "primary" | "ghost";
  icon?: React.ReactNode;
}

export function GlassButton({
  title,
  variant = "ghost",
  icon,
  style,
  ...rest
}: GlassButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.7}
      {...rest}
    >
      {!isPrimary && (
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      {isPrimary && (
        <LinearGradient
          colors={[theme.colors.primary, "#ff4d00"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {title && (
          <Text style={[styles.title, isPrimary && styles.titlePrimary]}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    height: 56,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  titlePrimary: {
    color: "#ffffff",
  },
  iconContainer: {
    marginRight: 8,
  },
});
