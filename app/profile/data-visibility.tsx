import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Info } from "lucide-react-native";
import { useRouter } from "expo-router";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { GlassCard } from "../../components/ui/GlassCard";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { CustomSwitch } from "../../components/ui/CustomSwitch";

export default function DataVisibilityScreen() {
  const router = useRouter();
  const [aiTraining, setAiTraining] = useState(false);
  const [usageStats, setUsageStats] = useState(true);
  const [crashReports, setCrashReports] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      <NoiseTexture />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Visibility</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionLabel label="PRIVACY CONTROLS" style={styles.sectionLabel} />
        
        <GlassCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>AI Model Training</Text>
              <Text style={styles.desc}>Allow your anonymized data to improve our processing models.</Text>
            </View>
            <CustomSwitch value={aiTraining} onValueChange={setAiTraining} />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Usage Statistics</Text>
              <Text style={styles.desc}>Share how you use the app to help us prioritize features.</Text>
            </View>
            <CustomSwitch value={usageStats} onValueChange={setUsageStats} />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Crash Reports</Text>
              <Text style={styles.desc}>Automatically send technical reports if the app stops working.</Text>
            </View>
            <CustomSwitch value={crashReports} onValueChange={setCrashReports} />
          </View>
        </GlassCard>

        <View style={styles.infoCard}>
          <Info color={theme.colors.primary} size={18} />
          <Text style={styles.infoText}>
            Your personal identifiable information is never sold or shared with third parties. All data used for training is strictly anonymized.
          </Text>
        </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 16,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,107,53,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.15)",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255,107,53,0.8)",
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  }
});
