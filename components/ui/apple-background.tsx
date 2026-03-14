import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Base64 generic white/black noise texture to repeat across the screen
const NOISE_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANYYcVAAAABXRSTlMA//9/f3+9c39+AAAAgklEQVQ4y2NgQAX8DIxgTAYGMwMEMBgwMHCQAwUYYBQoKAhXAJIBjLgCKQYw4gqkGMCIE1CUkYGBjAEEGBwYyBhAgMWBQQQowOAgyMAGFMBwYBAEijE4MKQBxRgcGMSAogwODOlAMQYHBglAAQYHBkkYxQYHBjGgKIMDgxBAQDEGLgAAy0kP+bBq/30AAAAASUVORK5CYII=";

export const AppleBackground = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 25000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Deep Dark Base */}
      <View style={[styles.absoluteFill, { backgroundColor: "#060608" }]} />

      {/* Animated Mesh Gradients (Aurora/Orbs) */}
      <Animated.View
        style={[styles.absoluteFill, styles.center, animatedStyle]}
      >
        {/* We make the SVG larger than the screen so the rotation occurs smoothly without cutting off */}
        <Svg width={width * 1.5} height={height * 1.5} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient
              id="gradRed"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#ff1f3d" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#ff1f3d" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient
              id="gradPurple"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#6b1fff" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#6b1fff" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient
              id="gradTeal"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#00f0ff" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Top-Right Red Orb */}
          <Circle cx="80" cy="20" r="50" fill="url(#gradRed)" />
          {/* Bottom-Left Purple Orb */}
          <Circle cx="20" cy="80" r="60" fill="url(#gradPurple)" />
          {/* Top-Left Teal Orb */}
          <Circle cx="10" cy="30" r="40" fill="url(#gradTeal)" />
        </Svg>
      </Animated.View>

      {/* Noise Texture Overlay */}
      <Image
        source={{ uri: NOISE_URI }}
        style={styles.noiseOverlay}
        resizeMode="repeat"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.1, // Subtle grain effect exactly like Apple glass
  },
});
