import React from "react";
import { StyleSheet, View } from "react-native";

export const BackgroundEffects = () => {
  return (
    <View
      style={[StyleSheet.absoluteFillObject, styles.container]}
      pointerEvents="none"
    >
      {/* Add your background gradients, glows, or other effects here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // You can apply base background effects here
  },
});
