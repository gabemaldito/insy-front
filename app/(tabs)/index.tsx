import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Mic, User } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Easing,
  Pressable,
  Animated as RNAnimated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { theme } from "../../constants/theme";
import { useInsyStore } from "../../store/useInsyStore";

export default function DashboardScreen() {
  const { isRecording, setRecording, captures } = useInsyStore();
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    let loop: RNAnimated.CompositeAnimation;
    if (!isRecording) {
      loop = RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          RNAnimated.timing(pulseAnim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    } else {
      pulseAnim.setValue(1.1);
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [isRecording, pulseAnim]);

  const handlePressIn = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setRecording(true);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
    } catch (err) {
      console.error("Failed to start recording", err);
      setRecording(false);
    }
  };

  const handlePressOut = async () => {
    if (isRecording) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRecording(false);

      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
          const uri = recordingRef.current.getURI();
          console.log("Recording stopped and stored at", uri);
          // TODO: enviar URI para transcrição via endpoint POST /captures
        } catch (error) {
          console.error("Failed to stop recording", error);
        }
        recordingRef.current = null;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground />
      <NoiseTexture />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.subtitle}>What's on your mind?</Text>
        </View>
        <View style={styles.avatarContainer}>
          <User color="#fff" size={20} />
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.micWrapper}>
          <RNAnimated.View
            style={[
              styles.ringOuter,
              isRecording && { borderColor: "rgba(255,107,53,0.4)" },
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <RNAnimated.View
            style={[
              styles.ringInner,
              isRecording && { borderColor: "rgba(255,107,53,0.5)" },
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.micButton,
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
          >
            <LinearGradient
              colors={["#ff6b35", "#ff4d00"]}
              style={styles.micGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Mic color="#ffffff" size={40} />
            </LinearGradient>
          </Pressable>
        </View>
        <Text
          style={[
            styles.holdText,
            isRecording && { color: theme.colors.primary },
          ]}
        >
          {isRecording ? "Gravando..." : "Hold to record"}
        </Text>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.recentLabel}>RECENT CAPTURES</Text>
        {captures.slice(0, 2).map((capture, i) => (
          <GlassCard key={capture.id} style={styles.recentCard}>
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>{capture.title}</Text>
              <Text style={styles.recentSubtitle}>{capture.subtitle}</Text>
            </View>
            <Text style={styles.recentTime}>{capture.timestamp}</Text>
          </GlassCard>
        ))}
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  greeting: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  avatarContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  micWrapper: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  ringOuter: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.1)",
  },
  ringInner: {
    position: "absolute",
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.18)",
  },
  micButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: "hidden",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  micGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  holdText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 24,
    fontFamily: "Inter_600SemiBold",
  },
  recentSection: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Make room for bottom tab bar
  },
  recentLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    textTransform: "uppercase",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  recentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  recentSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  recentTime: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
});
