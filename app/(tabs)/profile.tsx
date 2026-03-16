import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomSwitch } from "../../components/ui/CustomSwitch";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { SettingsRow } from "../../components/ui/SettingsRow";
import { theme } from "../../constants/theme";
import { useInsyStore } from "../../store/useInsyStore";

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useInsyStore((state) => state.profile);
  const isPro = useInsyStore((state) => state.isPro);
  const signOut = useInsyStore((state) => state.signOut);
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.35} />
      <NoiseTexture />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
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
            <Text style={styles.userName}>
              {profile?.full_name || profile?.user_metadata?.full_name || "Guest User"}
            </Text>
            <Text style={styles.userEmail}>
              {profile?.email || "No email linked"}
            </Text>

            <View style={isPro ? styles.proBadge : styles.freeBadge}>
              <Star
                color={isPro ? "rgba(255,107,53,0.90)" : "rgba(255,255,255,0.4)"}
                size={10}
                fill={isPro ? "rgba(255,107,53,0.90)" : "transparent"}
                style={styles.proBadgeIcon}
              />
              <Text style={isPro ? styles.proBadgeText : styles.freeBadgeText}>
                {isPro ? "Pro Plan" : "Free Plan"}
              </Text>
            </View>
          </View>
        </View>

        {!isPro && (
          <TouchableOpacity style={styles.upgradeCard}>
            <LinearGradient
              colors={["#ff6b35", "#ff4d00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.upgradeGradient}
            >
              <View>
                <Text style={styles.upgradeTitle}>Unlock Insy Pro</Text>
                <Text style={styles.upgradeSubtitle}>Unlimited ideas & AI organization</Text>
              </View>
              <View style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>UPGRADE</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

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
              onPress={() => router.push("/profile/personal")}
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
              onPress={() => router.push("/profile/subscription")}
            />
            <SettingsRow
              icon={<Lock color="rgba(99,160,255,1)" size={16} />}
              iconBgColor="rgba(99,160,255,0.10)"
              label="Privacy & Security"
              isLast
              onPress={() => router.push("/profile/privacy")}
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
              onPress={() => router.push("/profile/language")}
            />
            <SettingsRow
              icon={<Globe color="rgba(16,185,129,1)" size={16} />}
              iconBgColor="rgba(16,185,129,0.12)"
              label="AI Model"
              rightElement={<Text style={styles.rowValue}>GPT-4o</Text>}
              hideChevron
              isLast
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
            onPress={handleSignOut}
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
  freeBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  freeBadgeText: {
    color: "rgba(255,255,255,0.40)",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  upgradeCard: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  upgradeTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  upgradeSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  upgradeButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: "#ff4d00",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
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
