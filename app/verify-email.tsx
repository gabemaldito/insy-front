import { useRouter } from "expo-router";
import { MailCheck } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleReturnToLogin = () => {
    router.replace("/login");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MailCheck color="#ffffff" size={48} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>Check your email.</Text>
        <Text style={styles.subtitle}>
          We've sent you a secure link to verify your account or reset your
          password. Please check your inbox.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleReturnToLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Return to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060608",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 16,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 48,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: "90%",
  },
  primaryButton: {
    backgroundColor: "#ffffff",
    width: "100%",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ffffff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryButtonText: {
    color: "#060608",
    fontSize: 16,
    fontWeight: "700",
  },
});
