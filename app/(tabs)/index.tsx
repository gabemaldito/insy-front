import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Mic } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { SectionLabel } from "../../components/ui/SectionLabel";
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
  const scrollViewRef = useRef<ScrollView>(null);
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

  const [currentTypingText, setCurrentTypingText] = React.useState("");
  const [activeSentenceKey, setActiveSentenceKey] = React.useState(0);

  const sentences = [
    "Thinking about monetization strategy",
    "Brainstorming UX improvements",
    "Reducing login friction",
    "Using Apple Pay for ADHD focus",
    "Restructuring the Vault screen",
    "Adding glassmorphism effects",
    "Optimizing recording animations",
    "Finalizing the Apple Store prep",
  ];

  React.useEffect(() => {
    let timeoutId: any;
    
    if (isRecording) {
      let sentenceIdx = 0;
      
      const runTypingLoop = (words: string[], wordIdx: number) => {
        if (!isRecording) return;
        
        if (wordIdx < words.length) {
          // Sliding window: mostra no máximo as últimas 5 palavras
          const visible = words.slice(0, wordIdx + 1).slice(-5);
          setCurrentTypingText(visible.join(" "));
          
          timeoutId = setTimeout(() => {
            runTypingLoop(words, wordIdx + 1);
          }, 550); // Ritmo mais calmo e elegante
        } else {
          // Fim da frase: pausa para leitura completa
          timeoutId = setTimeout(() => {
            if (!isRecording) return;
            
            // Limpa para respirar antes da próxima ideia
            setCurrentTypingText("");
            
            timeoutId = setTimeout(() => {
              if (!isRecording) return;
              
              sentenceIdx = (sentenceIdx + 1) % sentences.length;
              setActiveSentenceKey(k => k + 1); // Dispara o FadeIn da próxima frase
              const nextWords = sentences[sentenceIdx].split(" ");
              runTypingLoop(nextWords, 0);
            }, 800);
          }, 2500); 
        }
      };

      const initialWords = sentences[0].split(" ");
      runTypingLoop(initialWords, 0);
    } else {
      setCurrentTypingText("");
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isRecording]);

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
                <Stop
                  offset="0%"
                  stopColor={theme.colors.primary}
                  stopOpacity="1"
                />
                <Stop offset="100%" stopColor="#c0150a" stopOpacity="1" />
              </RadialGradient>
              <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                <Stop
                  offset="0%"
                  stopColor={theme.colors.primary}
                  stopOpacity="0.4"
                />
                <Stop
                  offset="100%"
                  stopColor={theme.colors.primary}
                  stopOpacity="0"
                />
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

        {isRecording && currentTypingText !== "" && (
          <GlassCard style={styles.geminiCard} intensity={25}>
            <Animated.Text 
              key={activeSentenceKey}
              entering={FadeIn.duration(800)}
              exiting={FadeOut.duration(400)}
              style={styles.geminiTextMain}
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {currentTypingText}
            </Animated.Text>
          </GlassCard>
        )}

        <Text
          style={[
            styles.statusText,
            isRecording && { color: theme.colors.primary, marginTop: 10 },
          ]}
        >
          {isRecording ? "LISTENING..." : "HOLD TO RECORD"}
        </Text>
      </View>

      <View style={styles.footer}>
        <SectionLabel label="RECENT CAPTURES" />
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
  geminiCard: {
    width: width * 0.85,
    height: 56,
    borderRadius: 28,
    marginTop: 20,
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  geminiTextMain: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
});
