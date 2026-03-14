import { Image } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";

export function NoiseTexture() {
  return (
    <Image
      source={{
        uri: "https://www.transparenttextures.com/patterns/stardust.png",
      }}
      style={styles.container}
      contentFit="cover"
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.035,
    zIndex: -1,
  },
});
