import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, User, Mail, Calendar } from "lucide-react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { SectionLabel } from "../../components/ui/SectionLabel";

export default function PersonalInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      <NoiseTexture />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionLabel label="IDENTIFICATION" style={styles.sectionLabel} />
        
        <GlassCard style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <User color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>Gabriel Maldito</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Mail color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>gabriel@insy.app</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Calendar color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>Member Since</Text>
              <Text style={styles.value}>March 2024</Text>
            </View>
          </View>
        </GlassCard>

        <Text style={styles.infoFooter}>
          This information is synced with your Supabase account and is used to personalize your experience.
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
    padding: 8, // Reduced since GlassCard has internal 16px padding
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
    marginLeft: 60, // Align with the start of the text
  },
  infoFooter: {
    marginTop: 24,
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: "Inter_400Regular",
  }
});
