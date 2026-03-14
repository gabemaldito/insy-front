import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Apple, Chrome, Mic } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassButton } from "../../components/ui/GlassButton";
import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { theme } from "../../constants/theme";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleAppleAuth = () => {
    // TODO: implementar OAuth antes de navegar
    router.replace("/(tabs)");
  };

  const handleGoogleAuth = () => {
    // TODO: implementar OAuth antes de navegar
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground />
      <NoiseTexture />

      <View style={styles.content}>
        <View style={styles.header}>
          <LinearGradient
            colors={["#ff6b35", "#ff4d00"]}
            style={styles.logo}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Mic color="#ffffff" size={24} />
          </LinearGradient>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Voice-to-idea</Text>
          </View>

          <Text style={styles.headline}>Capture the chaos.</Text>
          <Text style={styles.subtitle}>
            Zero friction. Tap, speak, AI organizes.
          </Text>
        </View>

        <GlassCard style={styles.featuresCard}>
          <FeatureItem text="No typing needed" />
          <FeatureItem text="AI auto-organizes ideas" />
          <FeatureItem text="Built for ADHD brains" />
        </GlassCard>

        <View style={styles.footer}>
          <GlassButton
            title="Continue with Apple"
            variant="primary"
            icon={<Apple color="#ffffff" size={20} />}
            onPress={handleAppleAuth}
            style={styles.button}
          />
          <GlassButton
            title="Continue with Google"
            variant="ghost"
            icon={<Chrome color="#ffffff" size={20} />}
            onPress={handleGoogleAuth}
            style={styles.button}
          />

          <Text style={styles.termsText}>
            By continuing, you agree to our Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.dot} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  badge: {
    backgroundColor: "rgba(255,107,53,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.2)",
    marginBottom: 16,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  headline: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  featuresCard: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 12,
  },
  featureText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  footer: {
    width: "100%",
  },
  button: {
    marginBottom: 12,
  },
  termsText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 8,
  },
});
