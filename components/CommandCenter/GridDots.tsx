import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export const GridDots = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-12);

  useEffect(() => {
    opacity.value = withDelay(
      300,
      withTiming(0.12, {
        duration: 1000,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
    translateY.value = withDelay(
      300,
      withTiming(0, { duration: 1000, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {Array.from({ length: 16 }).map((_, i) => (
        <View key={i} style={styles.dot} />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    right: 28,
    width: 36, // 4 columns * 3px + 3 gaps * 8px = 12 + 24 = 36
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    zIndex: 2,
  },
  dot: {
    width: 3,
    height: 3,
    backgroundColor: "white",
    borderRadius: 1.5,
  },
});
