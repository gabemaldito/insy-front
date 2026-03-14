import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  subtextColor?: string;
  flex?: number;
}

export function StatsCard({
  label,
  value,
  subtext,
  subtextColor = "rgba(255,255,255,0.70)",
  flex = 1,
}: StatsCardProps) {
  return (
    <View style={[styles.container, { flex }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtext && (
        <Text style={[styles.subtext, { color: subtextColor }]}>{subtext}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
  },
  label: {
    fontSize: 10,
    color: "rgba(255,255,255,0.30)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subtext: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
