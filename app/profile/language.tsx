import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Check } from "lucide-react-native";
import { useRouter } from "expo-router";

import { theme } from "../../constants/theme";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { GlassCard } from "../../components/ui/GlassCard";

const LANGUAGES = [
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "pt", name: "Português", flag: "🇧🇷" },
  { id: "es", name: "Español", flag: "🇪🇸" },
  { id: "fr", name: "Français", flag: "🇫🇷" },
  { id: "de", name: "Deutsch", flag: "🇩🇪" },
  { id: "it", name: "Italiano", flag: "🇮🇹" },
  { id: "jp", name: "日本語", flag: "🇯🇵" },
];

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("en");

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard style={styles.listCard}>
          {LANGUAGES.map((lang, index) => {
            const isSelected = selectedLang === lang.id;
            const isLast = index === LANGUAGES.length - 1;
            
            return (
              <React.Fragment key={lang.id}>
                <TouchableOpacity 
                  style={styles.langItem}
                  onPress={() => setSelectedLang(lang.id)}
                >
                  <View style={styles.langInfo}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                    <Text style={[styles.langName, isSelected && styles.activeLangName]}>
                      {lang.name}
                    </Text>
                  </View>
                  {isSelected && <Check color={theme.colors.primary} size={20} />}
                </TouchableOpacity>
                {!isLast && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
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
    paddingBottom: 40,
  },
  listCard: {
    overflow: "hidden",
  },
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  langInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  flag: {
    fontSize: 20,
  },
  langName: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_500Medium",
  },
  activeLangName: {
    color: "#ffffff",
    fontFamily: "Inter_700Bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 20,
  }
});
