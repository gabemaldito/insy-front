import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Lock, Shield, Eye, Database } from "lucide-react-native";
import { useRouter } from "expo-router";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { GlassCard } from "../../components/ui/GlassCard";
import { SettingsRow } from "../../components/ui/SettingsRow";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>SECURITY</Text>
        <View style={styles.glassContainer}>
          <SettingsRow
            icon={<Shield color="rgba(99,160,255,1)" size={16} />}
            iconBgColor="rgba(99,160,255,0.10)"
            label="Two-factor Authentication"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Lock color="rgba(99,160,255,1)" size={16} />}
            iconBgColor="rgba(99,160,255,0.10)"
            label="Change Password"
            isLast
            onPress={() => {}}
          />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>DATA & PRIVACY</Text>
        <View style={styles.glassContainer}>
          <SettingsRow
            icon={<Eye color="rgba(99,160,255,1)" size={16} />}
            iconBgColor="rgba(99,160,255,0.10)"
            label="Data Visibility"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Database color="rgba(99,160,255,1)" size={16} />}
            iconBgColor="rgba(99,160,255,0.10)"
            label="Export My Data"
            isLast
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
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
  sectionTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  glassContainer: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    overflow: "hidden",
  },
  deleteButton: {
    marginTop: 48,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(239,68,68,0.05)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "rgba(239,68,68,0.8)",
    fontFamily: "Inter_600SemiBold",
  }
});
