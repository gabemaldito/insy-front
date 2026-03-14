import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, Line, LinearGradient, Rect, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface IsoLevelWarpProps {
  color?: string;
  speed?: number;
  density?: number;
}

export const IsoLevelWarp: React.FC<IsoLevelWarpProps> = ({
  color = "rgba(255, 31, 61, 0.3)", // Default to the red theme
  speed = 1,
  density = 40,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 4000 / speed,
        easing: Easing.linear,
      }),
      -1, // infinite loop
      false,
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    // Animating translateY by exactly one cell size creates an infinite scrolling illusion
    return {
      transform: [
        { perspective: 800 },
        { rotateX: "60deg" },
        { translateY: progress.value * density },
      ],
    };
  });

  const numLines = 60; // Enough lines to cover the screen even when rotated
  const gridWidth = numLines * density;
  const gridHeight = numLines * density;
  // Center the grid coordinates
  const offsetX = -(gridWidth - width) / 2;
  const offsetY = -(gridHeight - height) / 2 - 200; // Shift up because rotateX makes the bottom stretch

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Animated 3D Grid */}
      <Animated.View style={[styles.gridContainer, animatedStyle]}>
        <Svg
          width={gridWidth}
          height={gridHeight}
          style={{
            transform: [{ translateX: offsetX }, { translateY: offsetY }],
          }}
        >
          {/* Horizontal Lines */}
          {Array.from({ length: numLines }).map((_, i) => (
            <Line
              key={`h-${i}`}
              x1="0"
              y1={i * density}
              x2={gridWidth}
              y2={i * density}
              stroke={color}
              strokeWidth="1"
            />
          ))}
          {/* Vertical Lines */}
          {Array.from({ length: numLines }).map((_, i) => (
            <Line
              key={`v-${i}`}
              x1={i * density}
              y1="0"
              x2={i * density}
              y2={gridHeight}
              stroke={color}
              strokeWidth="1"
            />
          ))}
        </Svg>
      </Animated.View>

      {/* Cyber/Vignette Gradient Overlay for Depth */}
      <Svg style={StyleSheet.absoluteFillObject}>
        <Defs>
          {/* Radial-like or heavy vertical gradient to fade the horizon */}
          <LinearGradient id="horizonFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#060608" stopOpacity="1" />
            <Stop offset="0.3" stopColor="#060608" stopOpacity="0.8" />
            <Stop offset="0.6" stopColor="#060608" stopOpacity="0" />
            <Stop offset="1" stopColor="#060608" stopOpacity="0.9" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#horizonFade)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
