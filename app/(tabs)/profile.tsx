import { LinearGradient } from "expo-linear-gradient";
import {
  Coffee,
  Globe,
  Lock,
  LogOut,
  Star,
  Sun,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomSwitch } from "../../components/ui/CustomSwitch";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { SettingsRow } from "../../components/ui/SettingsRow";
import { theme } from "../../constants/theme";

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Orb slightly larger/higher to match the image's top orange glow */}
      <OrbBackground opacity={0.35} />
      <NoiseTexture />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Area */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={["#ff6b35", "#c0150a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <User color="#ffffff" size={32} />
          </LinearGradient>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>Gabriel Maldito</Text>
            <Text style={styles.userEmail}>gabriel@insy.app</Text>

            <View style={styles.proBadge}>
              <Star
                color="rgba(255,107,53,0.90)"
                size={10}
                fill="rgba(255,107,53,0.90)"
                style={styles.proBadgeIcon}
              />
              <Text style={styles.proBadgeText}>Pro Plan</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>142</Text>
            <Text style={styles.statsLabel}>IDEAS</Text>
          </View>
          <View style={[styles.statsCard, styles.streakCard]}>
            <Text style={styles.statsValue}>
              <Text style={{ color: "#ffffff" }}>🔥 </Text>
              <Text style={{ color: theme.colors.primary }}>12</Text>
            </Text>
            <Text
              style={[styles.statsLabel, { color: "rgba(255,107,53,0.60)" }]}
            >
              DAY STREAK
            </Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>4.2h</Text>
            <Text style={styles.statsLabel}>RECORDED</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.sectionGroup}>
          <SectionLabel label="ACCOUNT" />
          <View style={styles.glassContainer}>
            <SettingsRow
              icon={<User color="rgba(255,107,53,1)" size={16} />}
              iconBgColor="rgba(255,107,53,0.12)"
              label="Personal info"
              onPress={() => {}}
            />
            <SettingsRow
              icon={<Star color="rgba(250,204,21,1)" size={16} />}
              iconBgColor="rgba(250,204,21,0.10)"
              label="Subscription"
              rightElement={
                <View style={styles.rowBadge}>
                  <Text style={styles.rowBadgeText}>Pro</Text>
                </View>
              }
              onPress={() => {}}
            />
            <SettingsRow
              icon={<Lock color="rgba(99,160,255,1)" size={16} />}
              iconBgColor="rgba(99,160,255,0.10)"
              label="Privacy & Security"
              isLast
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionGroup}>
          <SectionLabel label="PREFERENCES" />
          <View style={styles.glassContainer}>
            <SettingsRow
              icon={<Coffee color="rgba(168,85,247,1)" size={16} />}
              iconBgColor="rgba(168,85,247,0.12)"
              label="Notifications"
              hideChevron
              rightElement={
                <CustomSwitch
                  value={notifications}
                  onValueChange={setNotifications}
                />
              }
            />
            <SettingsRow
              icon={<Sun color="rgba(209,213,219,1)" size={16} />}
              iconBgColor="rgba(209,213,219,0.12)"
              label="Language"
              rightElement={<Text style={styles.rowValue}>English</Text>}
              onPress={() => {}}
            />
            <SettingsRow
              icon={<Globe color="rgba(16,185,129,1)" size={16} />}
              iconBgColor="rgba(16,185,129,0.12)"
              label="AI Model"
              rightElement={<Text style={styles.rowValue}>GPT-4o</Text>}
              isLast
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={[styles.glassContainer, styles.signOutContainer]}>
          <SettingsRow
            icon={<LogOut color="rgba(239,68,68,0.75)" size={16} />}
            iconBgColor="rgba(239,68,68,0.10)"
            label="Sign out"
            textColor="rgba(239,68,68,0.75)"
            hideChevron
            isLast
            onPress={() => {}}
          />
        </View>

        <Text style={styles.footerText}>
          Insy v1.0.0 · Made with ❤️ for ADHD brains
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 120, // tab bar padding
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  editButton: {
    backgroundColor: "rgba(255,107,53,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.25)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editButtonText: {
    color: "rgba(255,107,53,0.85)",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(255,107,53,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.40)",
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  proBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,107,53,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.25)",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  proBadgeIcon: {
    marginRight: 4,
  },
  proBadgeText: {
    color: "rgba(255,107,53,0.90)",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  streakCard: {
    borderColor: "rgba(255,107,53,0.20)", // Subtle orange border for the streak
    backgroundColor: "rgba(255,107,53,0.05)",
  },
  statsValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  statsLabel: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 10,
    textTransform: "uppercase",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  sectionGroup: {
    marginBottom: 24,
  },
  glassContainer: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    overflow: "hidden",
  },
  signOutContainer: {
    marginTop: 8,
  },
  rowBadge: {
    backgroundColor: "rgba(250,204,21,0.10)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.20)",
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginRight: 8,
  },
  rowBadgeText: {
    color: "rgba(250,204,21,0.80)",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  rowValue: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginRight: 8,
  },
  footerText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.15)",
    textAlign: "center",
    marginTop: 24,
    fontFamily: "Inter_400Regular",
  },
});
