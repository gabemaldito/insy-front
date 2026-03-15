import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { Mic } from "lucide-react-native";
import React, { useRef, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useFrameCallback,
  useAnimatedProps,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Path, Defs, RadialGradient, Stop, Circle } from "react-native-svg";

import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { theme } from "../../constants/theme";
import { useInsyStore } from "../../store/useInsyStore";

const { width } = Dimensions.get("window");
const SIZE = 130;
const CANVAS_SIZE = SIZE + 100;
const CX = CANVAS_SIZE / 2;
const CY = CANVAS_SIZE / 2;
const BASE_R = SIZE / 2;
const NUM_POINTS = 64; // Reduzido para performance SVG máxima

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function DashboardScreen() {
  const { isRecording, setRecording, captures } = useInsyStore();
  const recordingRef = useRef<Audio.Recording | null>(null);
  const pressStartAt = useRef<number>(0);

  // Reanimated shared values
  const amp = useSharedValue(0);
  const elapsed = useSharedValue(0);
  const voiceTarget = useSharedValue(0);
  const voiceAmp = useSharedValue(0);
  const voiceTimer = useSharedValue(0);

  // Animation loop
  useFrameCallback((frameInfo) => {
    "worklet";
    const dt = Math.min((frameInfo.timeSincePreviousFrame ?? 16) / 1000, 0.05);
    elapsed.value += dt;

    if (isRecording) {
      voiceTimer.value += dt;
      if (voiceTimer.value > 0.15) {
        voiceTimer.value = 0;
        voiceTarget.value = 4 + Math.random() * 8;
      }
      voiceAmp.value += (voiceTarget.value - voiceAmp.value) * dt * 10;
      amp.value += (voiceAmp.value - amp.value) * dt * 8;
    } else {
      amp.value += (0 - amp.value) * dt * 5;
    }
  });

  // SVG Animated Props
  const blobProps = useAnimatedProps(() => {
    const t = elapsed.value;
    const waveAmp = amp.value;
    let d = "";

    for (let i = 0; i <= NUM_POINTS; i++) {
      const angle = (i / NUM_POINTS) * Math.PI * 2;
      const noise =
        Math.sin(angle * 2 + t * 2) * waveAmp * 0.4 +
        Math.sin(angle * 3 - t * 2.5) * waveAmp * 0.3 +
        Math.sin(angle * 4 + t * 1.8) * waveAmp * 0.2;
      
      const r = BASE_R + noise;
      const x = CX + Math.cos(angle) * r;
      const y = CY + Math.sin(angle) * r;
      
      if (i === 0) d += `M ${x.toFixed(2)},${y.toFixed(2)}`;
      else d += ` L ${x.toFixed(2)},${y.toFixed(2)}`;
    }
    return { d: d + " Z" };
  });

  const startRecording = async () => {
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

  const stopRecording = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setRecording(false);
    voiceAmp.value = 0;
    voiceTarget.value = 0;

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        console.log("Recording stored at", uri);
        // Em um app real, processaríamos aqui. Para o MVP, mostramos logs.
      } catch (error) {
        console.error("Failed to stop recording", error);
      }
      recordingRef.current = null;
    }
  };

  const handlePressIn = () => {
    if (isRecording) {
      stopRecording();
      pressStartAt.current = 0;
      return;
    }
    pressStartAt.current = Date.now();
    startRecording();
  };

  const handlePressOut = () => {
    if (!isRecording || pressStartAt.current === 0) return;
    const duration = Date.now() - pressStartAt.current;
    if (duration < 500) return; // Se for só um tap rápido, ignora o release (fica no modo "on/off")
    stopRecording();
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
        <View style={styles.topIcon}>
          <Text style={styles.betaBadge}>BETA</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.micContainer}
        >
          <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} style={styles.svg}>
            <Defs>
              <RadialGradient id="blobGrad" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="1" />
                <Stop offset="100%" stopColor="#c0150a" stopOpacity="1" />
              </RadialGradient>
              <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.4" />
                <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0" />
              </RadialGradient>
            </Defs>

            {/* Glow pulsante de fundo */}
            <Circle
              cx={CX}
              cy={CY}
              r={BASE_R + 40}
              fill="url(#glowGrad)"
              opacity={isRecording ? 0.6 : 0.2}
            />

            {/* Anéis externos estáticos (mais estáveis) */}
            <Circle
              cx={CX}
              cy={CY}
              r={BASE_R + 18}
              stroke="#ffffff"
              strokeWidth={0.5}
              fill="none"
              opacity={0.15}
            />
            <Circle
              cx={CX}
              cy={CY}
              r={BASE_R + 32}
              stroke="#ffffff"
              strokeWidth={0.5}
              fill="none"
              opacity={0.08}
            />

            {/* O BLOB - Agora em react-native-svg para estabilidade total */}
            <AnimatedPath
              animatedProps={blobProps}
              fill="url(#blobGrad)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
            />
          </Svg>

          <View style={styles.micIconWrapper} pointerEvents="none">
            <Mic color="#ffffff" size={42} strokeWidth={1.5} />
          </View>
        </Pressable>

        <Text style={[styles.statusText, isRecording && { color: theme.colors.primary }]}>
          {isRecording ? "LISTENING..." : "HOLD TO RECORD"}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>RECENT CAPTURES</Text>
        {captures.slice(0, 2).map((item) => (
          <GlassCard key={item.id} style={styles.captureCard}>
            <View style={styles.captureInfo}>
              <Text style={styles.captureTitle}>{item.title}</Text>
              <Text style={styles.captureSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.captureTime}>{item.timestamp}</Text>
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
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  greeting: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  topIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  betaBadge: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    backgroundColor: "rgba(255,107,53,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.2)",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  micContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    position: "absolute",
  },
  micIconWrapper: {
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  statusText: {
    marginTop: 40,
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  footerLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
  },
  captureCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
  },
  captureInfo: { flex: 1 },
  captureTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  captureSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  captureTime: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
});