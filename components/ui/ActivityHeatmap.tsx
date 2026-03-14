import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ActivityHeatmap() {
  // Generate mock data for the 7x5 grid (35 cells)
  const cells = Array.from({ length: 35 }).map((_, i) => {
    // Random intensity 0-3 just for mockup visually identical to reference
    const intensity =
      [
        0, 0, 0, 1, 0, 2, 0, 0, 1, 1, 0, 3, 1, 0, 0, 0, 1, 1, 1, 2, 0, 0, 2, 1,
        0, 1, 3, 0, 1, 0, 2, 0, 3, 1, 2,
      ][i] || 0;
    return intensity;
  });

  const getColor = (level: number) => {
    switch (level) {
      case 1:
        return "rgba(255,107,53,0.20)";
      case 2:
        return "rgba(255,107,53,0.50)";
      case 3:
        return "rgba(255,107,53,0.88)";
      default:
        return "rgba(255,255,255,0.07)";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cells.map((level, i) => (
          <View
            key={i}
            style={[styles.cell, { backgroundColor: getColor(level) }]}
          />
        ))}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendColors}>
          <View style={[styles.legendCell, { backgroundColor: getColor(0) }]} />
          <View style={[styles.legendCell, { backgroundColor: getColor(1) }]} />
          <View style={[styles.legendCell, { backgroundColor: getColor(2) }]} />
          <View style={[styles.legendCell, { backgroundColor: getColor(3) }]} />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  cell: {
    width: "12.8%", // approx fit for 7 columns (100 / 7 - gap)
    aspectRatio: 1,
    borderRadius: 3,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  legendText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.30)",
    fontFamily: "Inter_500Medium",
  },
  legendColors: {
    flexDirection: "row",
    gap: 4,
  },
  legendCell: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});
