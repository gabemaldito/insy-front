import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Star, CreditCard, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { GlassCard } from "../../components/ui/GlassCard";

export default function SubscriptionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
              <Text style={styles.nextBillingText}>Next billing: Apr 15, 2024</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>DETAILS</Text>
        
        <GlassCard style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <CreditCard color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>PAYMENT METHOD</Text>
              <Text style={styles.value}>Visa ending in 4242</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Clock color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>BILLING CYCLE</Text>
              <Text style={styles.value}>Monthly</Text>
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity style={styles.manageButton}>
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
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  proCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
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
    marginBottom: 40,
  },
  proTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
  },
  proStatus: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_500Medium",
  },
  proFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  proPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
  },
  nextBilling: {},
  nextBillingText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  sectionTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    padding: 24,
    gap: 20,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,107,53,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Inter_500Medium",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  manageButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  manageButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Inter_600SemiBold",
  }
});
