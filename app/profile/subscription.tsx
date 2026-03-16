import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Star, CreditCard, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { SectionLabel } from "../../components/ui/SectionLabel";

import { useInsyStore } from "../../store/useInsyStore";

export default function SubscriptionScreen() {
  const router = useRouter();
  const isPro = useInsyStore((state) => state.isPro);

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      <NoiseTexture />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isPro ? (
          <LinearGradient
            colors={["#ff6b35", "#c0150a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proCard}
          >
            <View style={styles.proHeader}>
              <View>
                <Text style={styles.proTitle}>Pro Plan</Text>
                <Text style={styles.proStatus}>Active Subscription</Text>
              </View>
              <Star color="#ffffff" size={32} fill="#ffffff" />
            </View>
            
            <View style={styles.proFooter}>
              <Text style={styles.proPrice}>$9.99/mo</Text>
              <View style={styles.nextBilling}>
                <Text style={styles.nextBillingText}>Subscribed via App Store</Text>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <GlassCard style={[styles.proCard, { backgroundColor: "rgba(255,255,255,0.03)" }]}>
            <View style={styles.proHeader}>
              <View>
                <Text style={styles.proTitle}>Free Plan</Text>
                <Text style={styles.proStatus}>Limited features</Text>
              </View>
              <Star color="rgba(255,255,255,0.2)" size={32} />
            </View>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular", marginTop: -20, marginBottom: 20 }}>
              Upgrade to Pro to unlock unlimited recordings and advanced AI insights.
            </Text>
          </GlassCard>
        )}
        
        <SectionLabel label="DETAILS" style={styles.sectionLabel} />
        
        <GlassCard style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <CreditCard color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>Apple ID Account</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Clock color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>Billing Cycle</Text>
              <Text style={styles.value}>Monthly</Text>
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity 
          style={styles.manageButton}
          onPress={() => router.push("/profile/manage")}
        >
          <Text style={styles.manageButtonText}>Manage Subscription</Text>
        </TouchableOpacity>
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
  proCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 40,
    shadowColor: "#ff6b35",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  proHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  proTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
  },
  proStatus: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
  proFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  proPrice: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
  },
  nextBilling: {},
  nextBillingText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  sectionLabel: {
    marginBottom: 16,
  },
  card: {
    padding: 8,
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,107,53,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Inter_600SemiBold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 60,
  },
  manageButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  manageButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Inter_600SemiBold",
  }
});
