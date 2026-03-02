import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

export const SearchBar = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  // 1. Pega a altura dinâmica do teclado com o Reanimated
  const keyboard = useAnimatedKeyboard();

  useEffect(() => {
    opacity.value = withDelay(
      500,
      withTiming(1, { duration: 1000, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
    );
    translateY.value = withDelay(
      500,
      withTiming(0, { duration: 1000, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    // 2. Animação de entrada inicial E a altura negativa do teclado sendo aplicada na hora
    transform: [
      { translateY: translateY.value },
      { translateY: -keyboard.height.value },
    ],
  }));

  return (
    <Animated.View
      style={[styles.container, animatedStyle, styles.shadowContainer]}
    >
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Svg viewBox="0 0 18 18" fill="none" width="18" height="18">
              <Circle
                cx="7.5"
                cy="7.5"
                r="5.5"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.5"
              />
              <Path
                d="M11.5 11.5L15.5 15.5"
                stroke="hsla(0, 0%, 100%, 0.35)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Search commands, apps, people…"
            placeholderTextColor="rgba(255,255,255,0.2)"
            selectionColor="#ff1f3d"
          />
          <View style={styles.kbd}>
            <Text style={styles.kbdText}>⌘</Text>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 54,
    left: 24,
    right: 24,
    zIndex: 10,
  },
  shadowContainer: {
    shadowColor: "#ff1f3d",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 20,
    borderRadius: 999, // Segue o arredondamento
  },
  blurContainer: {
    borderRadius: 999,
    overflow: "hidden", //Corta o blur vazando pelos cantos
  },
  searchBar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "hsla(0, 0%, 100%, 0.14)",
    borderRadius: 999,
    gap: 12,
  },
  searchIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    fontWeight: "300",
    letterSpacing: 0.15,
  },
  kbd: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  kbdText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.25)",
  },
});
