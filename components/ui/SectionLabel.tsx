import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

interface SectionLabelProps extends TextProps {
  label: string;
}

export function SectionLabel({ label, style, ...rest }: SectionLabelProps) {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.25)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
});
