import React from "react";
import { View, StyleSheet } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

export default function TestSkia() {
  const path = Skia.Path.Make();
  path.addCircle(100, 100, 50);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Path path={path} color="blue" />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  canvas: {
    width: 200,
    height: 200,
  },
});
