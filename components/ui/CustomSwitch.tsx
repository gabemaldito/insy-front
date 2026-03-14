import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface SwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export function CustomSwitch({ value, onValueChange }: SwitchProps) {
  const activeAnim = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        value ? "rgba(255,107,53,0.85)" : "rgba(255,255,255,0.1)",
      ),
    };
  });

  const knobAnim = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(value ? 16 : 0) }],
    };
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, activeAnim]}>
        <Animated.View style={[styles.knob, knobAnim]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 36,
    height: 20,
    borderRadius: 10,
    padding: 2,
    justifyContent: "center",
  },
  knob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
});
