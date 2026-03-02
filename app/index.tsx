import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.center}>
        <Text style={styles.title}>Bem-vindo ao App</Text>
        <Text style={styles.subtitle}>
          Sua jornada de onboarding começa aqui.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { marginBottom: Math.max(insets.bottom, 20) }]}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Avançar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060608",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.45)",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#060608",
    fontSize: 16,
    fontWeight: "700",
  },
});
