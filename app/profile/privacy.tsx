import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  CheckSquare,
  ChevronLeft,
  Database,
  Eye,
  Lock,
  Shield,
  Square,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomSwitch } from "../../components/ui/CustomSwitch";
import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { SettingsRow } from "../../components/ui/SettingsRow";
import { useInsyStore } from "../../store/useInsyStore";
import { theme } from "../../constants/theme";

export default function PrivacyScreen() {
  const router = useRouter();
  const [twoFactor, setTwoFactor] = useState(false);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const closeModal = () => {
    setShowDeleteModal(false);
    setConfirmCheckbox(false);
    setConfirmText("");
  };

  const isDeleteEnabled =
    confirmCheckbox && confirmText.toLowerCase() === "cancel my account";

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "We will generate a ZIP file containing all your recordings, transcriptions, and personal data. This might take a few minutes. Send to your email?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () =>
            Alert.alert(
              "Success",
              "Request received! You will receive an email shortly.",
            ),
        },
      ],
    );
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText.toLowerCase() === "cancel my account" && confirmCheckbox) {
      Alert.alert(
        "Warning",
        "Final confirmation: This will permanently delete your profile and sign you out. Continue?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes, Delete Everything",
            style: "destructive",
            onPress: async () => {
              setIsDeleting(true);
              try {
                const { supabase } = await import("../../utils/supabase");
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                  // 1. Delete profile data
                  const { error: profileError } = await supabase
                    .from("profiles")
                    .delete()
                    .eq("id", user.id);
                  
                  if (profileError) throw profileError;

                  // 2. Sign out and clear store
                  const signOut = useInsyStore.getState().signOut;
                  await signOut();

                  closeModal();
                  Alert.alert("Account Removed", "Your data has been deleted and you have been signed out.");
                  router.replace("/(auth)");
                }
              } catch (error: any) {
                console.error("Delete error:", error);
                Alert.alert("Error", "Failed to delete account data: " + error.message);
              } finally {
                setIsDeleting(false);
              }
            },
          },
        ],
      );
    } else if (!confirmCheckbox) {
      Alert.alert("Error", "Please check the confirmation box.");
    } else {
      Alert.alert("Error", 'Please type "cancel my account" exactly.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      <NoiseTexture />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel label="SECURITY" />
        <View style={styles.glassContainer}>
          <SettingsRow
            icon={<Shield color="rgba(99,160,255,1)" size={16} />}
            iconBgColor="rgba(99,160,255,0.10)"
            label="Two-factor Authentication"
            hideChevron
            rightElement={
              <CustomSwitch value={twoFactor} onValueChange={setTwoFactor} />
            }
          />
          <SettingsRow
            icon={<Lock color="rgba(99,160,255,1)" size={16} />}
            iconBgColor="rgba(99,160,255,0.10)"
            label="Change Password"
            onPress={() => router.push("/profile/change-password")}
            isLast
          />
        </View>

        <SectionLabel label="DATA & PRIVACY" style={{ marginTop: 32 }} />
        <View style={styles.glassContainer}>
          <SettingsRow
            icon={<Eye color="rgba(99,160,255,1)" size={16} />}
            iconBgColor="rgba(99,160,255,0.10)"
            label="Data Visibility"
            onPress={() => router.push("/profile/data-visibility")}
          />
          <SettingsRow
            icon={<Database color="rgba(99,160,255,1)" size={16} />}
            iconBgColor="rgba(99,160,255,0.10)"
            label="Export My Data"
            hideChevron
            onPress={handleExportData}
            isLast
          />
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeModal}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalWrapper}
          >
            <GlassCard style={styles.deleteCard} intensity={40}>
              <View style={styles.modalHeader}>
                <View style={styles.warningIcon}>
                  <AlertTriangle color="#ff4444" size={24} />
                </View>
                <TouchableOpacity onPress={closeModal}>
                  <X color="rgba(255,255,255,0.4)" size={24} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>Delete Account?</Text>
              <Text style={styles.modalDesc}>
                This action is irreversible. All your ideas, voice recordings,
                and AI insights will be lost forever.
              </Text>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setConfirmCheckbox(!confirmCheckbox)}
                activeOpacity={0.8}
              >
                {confirmCheckbox ? (
                  <CheckSquare color={theme.colors.primary} size={20} />
                ) : (
                  <Square color="rgba(255,255,255,0.2)" size={20} />
                )}
                <Text style={styles.checkboxLabel}>
                  I understand that my data cannot be recovered.
                </Text>
              </TouchableOpacity>

              <View style={styles.confirmInputContainer}>
                <Text style={styles.inputHint}>
                  Type{" "}
                  <Text style={{ color: "#ffffff", fontWeight: "700" }}>
                    cancel my account
                  </Text>{" "}
                  to confirm:
                </Text>
                <TextInput
                  style={styles.confirmInput}
                  value={confirmText}
                  onChangeText={setConfirmText}
                  placeholder="Type here..."
                  placeholderTextColor="rgba(255,255,255,0.15)"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmDeleteBtn,
                  isDeleteEnabled ? styles.btnEnabled : styles.btnDisabled,
                ]}
                onPress={handleDeleteAccount}
                disabled={!isDeleteEnabled || isDeleting}
              >
                <Text
                  style={[
                    styles.confirmDeleteBtnText,
                    (!isDeleteEnabled || isDeleting) && { color: "rgba(255,255,255,0.3)" },
                  ]}
                >
                  {isDeleting ? "Deleting Account..." : "Permanently Delete Account"}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    marginBottom: 60,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "rgba(239, 68, 68, 0.8)",
    fontFamily: "Inter_600SemiBold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalWrapper: {
    width: "100%",
  },
  deleteCard: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  warningIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,68,68,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,68,68,0.2)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  modalDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  confirmInputContainer: {
    marginBottom: 32,
  },
  inputHint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 12,
    fontFamily: "Inter_400Regular",
  },
  confirmInput: {
    height: 48,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    color: "#ffffff",
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  confirmDeleteBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  btnEnabled: {
    backgroundColor: "#ff4444ff",
    shadowColor: "#ff4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  confirmDeleteBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
