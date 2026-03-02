import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft color="#ffffff" size={24} />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.title}>Fazer Login</Text>
        <Text style={styles.subtitle}>
          Tela de exemplo de login. Insira suas credenciais.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { marginBottom: Math.max(insets.bottom, 20) }]}
        // Substituimos 'push' por 'replace' para que o painel principal substitua o login
        onPress={() => router.replace("/dashboard")}
      >
        <Text style={styles.buttonText}>Entrar no Dashboard</Text>
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
  backButton: {
    padding: 8,
    marginLeft: -8,
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
    backgroundColor: "#ff1f3d", // Vermelho do app
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
