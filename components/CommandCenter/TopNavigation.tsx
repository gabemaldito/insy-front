import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export const TopNavigation = () => {
  const router = useRouter(); // <-- 1. Ferramenta de roteamento
  const navigation = useNavigation(); // <-- 1.5. Navegação pura para Drawer
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-12);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    translateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* 2. Botão da Esquerda -> Abre o Drawer (Vault) */}
      <Pressable
        onPress={() =>
          navigation
            .getParent("LeftDrawer")
            ?.dispatch(DrawerActions.openDrawer())
        }
        style={({ pressed }) => [
          styles.iconBox,
          pressed && styles.iconBoxPressed,
        ]}
      >
        <Svg viewBox="0 0 18 18" fill="none" width="18" height="18">
          <Rect
            x="1.5"
            y="1.5"
            width="6"
            height="6"
            rx="1.5"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.5"
          />
          <Rect
            x="10.5"
            y="1.5"
            width="6"
            height="6"
            rx="1.5"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.5"
          />
          <Rect
            x="1.5"
            y="10.5"
            width="6"
            height="6"
            rx="1.5"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.5"
          />
          <Rect
            x="10.5"
            y="10.5"
            width="6"
            height="6"
            rx="1.5"
            fill="rgba(255,31,61,0.3)"
            stroke="rgba(255,31,61,0.7)"
            strokeWidth="1.5"
          />
        </Svg>
      </Pressable>

      {/* 3. Botão da Direita -> Abre o Drawer (Profile) */}
      <Pressable
        onPress={() =>
          navigation
            .getParent("RightDrawer")
            ?.dispatch(DrawerActions.openDrawer())
        }
        style={({ pressed }) => [
          styles.iconProfile,
          pressed && styles.iconProfilePressed,
        ]}
      >
        <Svg viewBox="0 0 20 20" fill="none" width="20" height="20">
          <Circle
            cx="10"
            cy="7"
            r="3"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
          />
          <Path
            d="M3.5 17C3.5 13.96 6.46 11.5 10 11.5C13.54 11.5 16.5 13.96 16.5 17"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    marginTop: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  iconBoxPressed: {
    borderColor: "rgba(255,31,61,0.5)",
    backgroundColor: "rgba(255,31,61,0.05)",
  },
  iconProfile: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,31,61,0.15)", // React Native doesn't support smooth View background gradients natively without Expo LinearGradient, we approximate it here or use SVGs
    overflow: "hidden",
  },
  iconProfilePressed: {
    borderColor: "rgba(255,31,61,0.5)",
  },
});
