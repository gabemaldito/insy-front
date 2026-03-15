import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../constants/theme";

interface TagProps {
  type: string;
  label?: string;
  color?: string;
}

export function Tag({ type, label, color }: TagProps) {
  const getStyles = () => {
    if (color) {
      return { bg: `${color}26`, text: color }; // 26 is ~15% opacity in hex
    }
    switch (type.toLowerCase()) {
      case "idea":
        return { bg: "rgba(255, 204, 0, 0.15)", text: "#FFCC00" };
      case "task":
        return { bg: "rgba(50, 150, 255, 0.15)", text: "#3296FF" };
      case "insight":
        return { bg: "rgba(52, 199, 89, 0.15)", text: "#34C759" };
      default:
        return { bg: "rgba(255, 255, 255, 0.1)", text: "#999999" };
    }
  };

  const { bg, text } = getStyles();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label || type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
