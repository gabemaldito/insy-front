import { BlurView } from "expo-blur";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { theme } from "../../constants/theme";

const { width } = Dimensions.get("window");

interface OrbBackgroundProps {
  opacity?: number;
}

export function OrbBackground({ opacity = 0.8 }: OrbBackgroundProps) {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.orb, { opacity }]} />
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    zIndex: -2,
    overflow: "hidden",
  },
  orb: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: theme.colors.primary,
    position: "absolute",
    top: -width * 0.3,
  },
});
