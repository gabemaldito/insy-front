import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AchievementBadgeProps {
  emoji: string;
  label: string;
  borderColor: string;
  labelColor: string;
  locked?: boolean;
}

export function AchievementBadge({
  emoji,
  label,
  borderColor,
  labelColor,
  locked = false,
}: AchievementBadgeProps) {
  return (
    <View style={[styles.container, locked ? styles.locked : { borderColor }]}>
      <Text style={[styles.emoji, locked && { opacity: 0.4 }]}>{emoji}</Text>
      <Text
        style={[
          styles.label,
          locked ? { color: "rgba(255,255,255,0.3)" } : { color: labelColor },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    marginRight: 8,
  },
  locked: {
    borderColor: "rgba(255,255,255,0.08)",
  },
  emoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
