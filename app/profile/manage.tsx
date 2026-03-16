import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, CreditCard, AlertCircle, RefreshCcw, ExternalLink } from "lucide-react-native";
import { useRouter } from "expo-router";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { SectionLabel } from "../../components/ui/SectionLabel";

import { useInsyStore } from "../../store/useInsyStore";

export default function ManageSubscriptionScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isPro = useInsyStore((state) => state.isPro);

  const handleCancel = () => {
    if (!isPro) {
      Alert.alert("No active subscription", "You are currently on the Free plan.");
      return;
    }
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your Pro plan? You will lose access to unlimited recordings and advanced AI insights at the end of your billing period.",
      [
        { text: "Keep Plan", style: "cancel" },
        { 
          text: "Cancel Subscription", 
          style: "destructive",
          onPress: () => console.log("Cancelled")
        }
      ]
    );
  };

  const handleRestore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Your purchases have been restored.");
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      <NoiseTexture />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionLabel label="SUBSCRIPTION STATUS" style={styles.sectionLabel} />
        
        <GlassCard style={styles.card}>
          <View style={styles.statusRow}>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{isPro ? "Pro Plan" : "Free Plan"}</Text>
              <Text style={styles.planStatus}>
                {isPro ? "Renews via App Store" : "Upgrade for more features"}
              </Text>
            </View>
            <View style={[styles.activeBadge, !isPro && { backgroundColor: "rgba(255,255,255,0.05)" }]}>
              <View style={[styles.activeDot, !isPro && { backgroundColor: "rgba(255,255,255,0.3)" }]} />
              <Text style={[styles.activeText, !isPro && { color: "rgba(255,255,255,0.4)" }]}>
                {isPro ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </GlassCard>

        <SectionLabel label="ACTIONS" style={styles.sectionLabel} />
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionRow} onPress={handleRestore} disabled={isLoading}>
            <View style={styles.actionIcon}>
              <RefreshCcw color="#ffffff" size={18} />
            </View>
            <Text style={styles.actionLabel}>Restore Purchases</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={() => {}}>
            <View style={styles.actionIcon}>
              <CreditCard color="#ffffff" size={18} />
            </View>
            <Text style={styles.actionLabel}>Manage Apple ID Billing</Text>
            <ExternalLink color="rgba(255,255,255,0.2)" size={14} />
          </TouchableOpacity>
        </View>

        <SectionLabel label="DANGER ZONE" style={styles.sectionLabel} />
        
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <AlertCircle color="#ff4444" size={18} />
          <Text style={styles.cancelText}>Cancel Subscription</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Subscription management is handled via the App Store. Changes may take a few minutes to reflect in the app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionLabel: {
    marginBottom: 16,
  },
  card: {
    padding: 8,
    marginBottom: 32,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  planStatus: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00ff88",
  },
  activeText: {
    fontSize: 12,
    color: "#00ff88",
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  actionsContainer: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
    fontFamily: "Inter_500Medium",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 68,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,68,68,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,68,68,0.1)",
    marginBottom: 24,
  },
  cancelText: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  footerNote: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
    fontFamily: "Inter_400Regular",
  }
});
