import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, User, Mail, Calendar } from "lucide-react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { GlassCard } from "../../components/ui/GlassCard";

export default function PersonalInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <User color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>FULL NAME</Text>
              <Text style={styles.value}>Gabriel Maldito</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Mail color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <Text style={styles.value}>gabriel@insy.app</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Calendar color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.label}>JOINED</Text>
              <Text style={styles.value}>March 2024</Text>
            </View>
          </View>
        </GlassCard>
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
  card: {
    padding: 24,
    gap: 20,
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
  }
});
