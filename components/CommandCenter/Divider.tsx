import React from "react";
import { StyleSheet, View } from "react-native";

export const Divider = () => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    position: "absolute",
    bottom: 130,
    left: 32,
    right: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  dividerLine: {
    width: "100%",
    height: 1,
    // LinearGradient for divider from transparent to white back to transparent
    backgroundColor: "rgba(255,255,255,0.05)", // Fallback without expo-linear-gradient
  },
});
