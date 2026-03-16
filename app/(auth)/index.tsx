import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Chrome, Mic } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { GlassButton } from "../../components/ui/GlassButton";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { theme } from "../../constants/theme";
import { supabase } from "../../utils/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Esquema direto do app - mais estável
      const redirectUrl = "insyfront://login";
      
      console.log("-> Google Login via Scheme:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

        if (res.type === "success") {
          const { url } = res;
          console.log("-> Login Retornou:", url);

          const parsed = Linking.parse(url);
          let access_token = parsed.queryParams?.access_token as string;
          let refresh_token = parsed.queryParams?.refresh_token as string;

          if (!access_token || !refresh_token) {
            const fragment = url.split("#")[1];
            if (fragment) {
              const params = new URLSearchParams(fragment);
              access_token = params.get("access_token") || "";
              refresh_token = params.get("refresh_token") || "";
            }
          }

          if (access_token && refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (sessionError) throw sessionError;
            console.log("-> Sessão ativada!");
          } else {
            throw new Error("Não foi possível encontrar os tokens de acesso na resposta.");
          }
        }
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      Alert.alert(
        "Erro de Autenticação",
        error.message || "Certifique-se de que o Redirect URL está correto no Supabase."
      );
    } finally {
      setIsLoading(false);
    }
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

        <View style={styles.authContainer}>
          <GlassButton
            title={isLoading ? "Connecting..." : "Sign in with Google"}
            variant="primary"
            icon={<Chrome color="#ffffff" size={22} />}
            onPress={handleGoogleAuth}
            disabled={isLoading}
            style={styles.mainButton}
          />
        </View>

        <View style={styles.footer}>
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
  authContainer: {
    width: "100%",
    marginVertical: 20,
    gap: 12,
  },
  inputWrapper: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    height: 58,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  input: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  mainButton: {
    height: 58,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  orText: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    marginHorizontal: 16,
    letterSpacing: 2,
  },
  socialButton: {
    height: 58,
  },
  footer: {
    width: "100%",
  },
  termsText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 8,
  },
});
