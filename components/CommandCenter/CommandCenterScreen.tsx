import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionChips } from "./ActionChips";
import { BackgroundEffects } from "./BackgroundEffects";
import { CenterHeadline } from "./CenterHeadline";
import { Divider } from "./Divider";
import { GridDots } from "./GridDots";
import { SearchBar } from "./SearchBar";
import { TopNavigation } from "./TopNavigation";

const { height } = Dimensions.get("window");

export const CommandCenterScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background layer */}
      <BackgroundEffects />

      {/* Main Content layer */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[styles.topSection, { paddingTop: Math.max(insets.top, 16) }]}
        >
          <TopNavigation />
          <GridDots />
        </View>

        <View style={styles.centerSection}>
          <CenterHeadline />
          <ActionChips />
        </View>

        <View
          style={[
            styles.bottomSection,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <Divider />
          <SearchBar />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060608", // var(--bg)
  },
  content: {
    flex: 1,
  },
  topSection: {
    zIndex: 10,
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: height * 0.1, // Push it slightly above the center
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180, // Enough room for divider and search bar
    justifyContent: "flex-end",
  },
});
