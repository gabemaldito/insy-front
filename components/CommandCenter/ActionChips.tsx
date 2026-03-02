import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const chips = [
  { id: "commands", label: "⌘ Commands" },
  { id: "workflows", label: "Workflows" },
  { id: "extensions", label: "Extensions" },
];

export const ActionChips = () => {
  const [activeChip, setActiveChip] = useState("commands");

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      400,
      withTiming(1, { duration: 1000, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
    );
    translateY.value = withDelay(
      400,
      withTiming(0, { duration: 1000, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {chips.map((chip) => {
        const isActive = activeChip === chip.id;
        return (
          <Pressable
            key={chip.id}
            onPress={() => setActiveChip(chip.id)}
            style={({ pressed }) => [
              styles.chip,
              isActive && styles.chipActive,
              pressed && !isActive && styles.chipHover,
            ]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    marginTop: 36,
    flexWrap: "wrap",
    paddingHorizontal: 32,
    zIndex: 10,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  chipActive: {
    borderColor: "rgba(255,31,61,0.45)",
    backgroundColor: "rgba(255,31,61,0.08)",
  },
  chipHover: {
    borderColor: "rgba(255,31,61,0.3)",
    backgroundColor: "rgba(255,31,61,0.06)",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 0.24,
  },
  chipTextActive: {
    color: "rgba(255,255,255,0.75)",
  },
});
