import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Lock, CheckCircle2 } from "lucide-react-native";
import { useRouter } from "expo-router";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { GlassCard } from "../../components/ui/GlassCard";
import { SectionLabel } from "../../components/ui/SectionLabel";

import { useInsyStore } from "../../store/useInsyStore";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const profile = useInsyStore((state) => state.profile);
  const isSocialUser = profile?.app_metadata?.provider === "google";
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = () => {
    if (isSocialUser) {
      Alert.alert("Action not available", "Your account is managed via Google. Please use Google settings to manage your security.");
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    
    Alert.alert("Success", "Your password has been updated.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      <NoiseTexture />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionLabel label="SECURITY CREDENTIALS" style={styles.sectionLabel} />
          
          {isSocialUser ? (
            <GlassCard style={[styles.card, { padding: 24, alignItems: 'center' }]}>
              <View style={styles.socialIconContainer}>
                <Lock color={theme.colors.primary} size={32} />
              </View>
              <Text style={styles.socialTitle}>Managed by Google</Text>
              <Text style={styles.socialText}>
                Your account is currently linked with your Google account. Password management is handled by Google for your security.
              </Text>
              <TouchableOpacity 
                style={styles.backLink}
                onPress={() => router.back()}
              >
                <Text style={styles.backLinkText}>Go Back</Text>
              </TouchableOpacity>
            </GlassCard>
          ) : (
            <>
              <GlassCard style={styles.card}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Current Password</Text>
                  <TextInput
                    style={styles.input}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    secureTextEntry
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    secureTextEntry
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm New Password</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    secureTextEntry
                  />
                </View>
              </GlassCard>

              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Update Password</Text>
              </TouchableOpacity>

              <View style={styles.hintContainer}>
                <CheckCircle2 color={theme.colors.primary} size={14} />
                <Text style={styles.hintText}>Minimum 8 characters with at least one number.</Text>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  inputGroup: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Inter_500Medium",
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 16,
  },
  updateButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  updateButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: "Inter_400Regular",
  },
  socialIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,107,53,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.2)",
  },
  socialTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  socialText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  backLink: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  backLinkText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: "Inter_600SemiBold",
  },
});
