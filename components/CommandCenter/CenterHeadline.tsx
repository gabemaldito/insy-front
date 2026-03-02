import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export const CenterHeadline = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      200,
      withTiming(1, { duration: 1000, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
    );
    translateY.value = withDelay(
      200,
      withTiming(0, { duration: 1000, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.center, animatedStyle]}>
      <Text style={styles.eyebrow}>COMMAND CENTER</Text>

      <View style={styles.headlineContainer}>
        <View style={styles.italicRow}>
          <Text style={[styles.headline, styles.headlineItalic]}>Your</Text>
          <View style={styles.italicUnderline} />
        </View>
        <Text style={styles.headline}>command</Text>
        <Text style={styles.headline}>center.</Text>
        <Text style={[styles.headline, styles.line2]}>Unified.</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  center: {
    marginTop: 120, // push down a bit
    paddingHorizontal: 32,
    zIndex: 10,
    alignItems: "flex-start",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "300",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#ff1f3d", // var(--red)
    marginBottom: 20,
    opacity: 0.85,
  },
  headlineContainer: {
    flexDirection: "column",
  },
  headline: {
    fontSize: 48,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 48 * 1.02,
    letterSpacing: -0.96, // JS calculation of em
  },
  italicRow: {
    alignSelf: "flex-start",
    position: "relative",
    marginBottom: 0,
  },
  headlineItalic: {
    fontStyle: "italic",
  },
  line2: {
    color: "rgba(255,255,255,0.35)",
    fontWeight: "700",
  },
  italicUnderline: {
    position: "absolute",
    bottom: 6,
    left: 0,
    right: -2,
    height: 3,
    backgroundColor: "#ff1f3d",
    borderRadius: 1.5,
    opacity: 0.6,
  },
});
