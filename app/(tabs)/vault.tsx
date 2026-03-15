import { Search, X, Calendar, Hash } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import { OrbBackground } from "../../components/ui/OrbBackground";
import { InsightCard } from "../../components/vault/InsightCard";
import { GlassCard } from "../../components/ui/GlassCard";
import { Tag } from "../../components/ui/Tag";
import { theme } from "../../constants/theme";
import { useInsyStore, VaultItem } from "../../store/useInsyStore";

const FILTERS = ["all", "idea", "task", "insight"] as const;

export default function VaultScreen() {
  const { vaultItems, selectedFilter, setFilter } = useInsyStore();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

  const filteredItems = vaultItems.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.type === selectedFilter;
  });

  const searchBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        isFocused ? "rgba(255,107,53,0.3)" : theme.colors.border,
        { duration: 200 },
      ),
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <OrbBackground opacity={0.3} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>The Vault</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{vaultItems.length} notes</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Animated.View style={[styles.searchGlass, searchBorderStyle]}>
            <Search
              color={theme.colors.textMuted}
              size={18}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Ask Insy anything..."
              placeholderTextColor={theme.colors.textMuted}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <View style={styles.shortcutBadge}>
              <Text style={styles.shortcutText}>⌘K</Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {FILTERS.map((f) => {
              const isActive = selectedFilter === f;
              return (
                <Text
                  key={f}
                  onPress={() => setFilter(f)}
                  style={[
                    styles.filterPill,
                    isActive && styles.filterPillActive,
                  ]}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              );
            })}
          </ScrollView>
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <InsightCard 
              item={item} 
              index={index} 
              onPress={() => setSelectedItem(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      {/* Detail Modal */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <Pressable 
            style={StyleSheet.absoluteFill} 
            onPress={() => setSelectedItem(null)} 
          />
          
          <View style={styles.modalContainer}>
            <GlassCard style={styles.modalCard} intensity={40}>
              <View style={styles.modalHeader}>
                <Tag type={selectedItem?.type || "idea"} />
                <Pressable 
                  onPress={() => setSelectedItem(null)}
                  style={styles.closeButton}
                >
                  <X color="#ffffff" size={20} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
                <Text style={styles.modalTime}>{selectedItem?.time}</Text>
                
                <View style={styles.modalDivider} />
                
                <Text style={styles.transcriptionLabel}>TRANSCRIPTION</Text>
                <Text style={styles.transcriptionText}>
                  {selectedItem?.transcription || selectedItem?.desc}
                </Text>

                {(selectedItem?.tags?.length || selectedItem?.due) && (
                  <View style={styles.modalMetadata}>
                    {selectedItem.due && (
                      <View style={styles.metaRow}>
                        <Calendar size={14} color={theme.colors.textMuted} />
                        <Text style={styles.metaText}>Due: {selectedItem.due}</Text>
                      </View>
                    )}
                    {selectedItem.tags?.map(tag => (
                      <View key={tag} style={styles.metaRow}>
                        <Hash size={14} color={theme.colors.textMuted} />
                        <Text style={styles.metaText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </GlassCard>
          </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginRight: 12,
  },
  badge: {
    backgroundColor: "rgba(255,107,53,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,107,53,0.3)",
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchGlass: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    height: "100%",
  },
  shortcutBadge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  shortcutText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  filtersWrapper: {
    marginBottom: 16,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterPill: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
  },
  filterPillActive: {
    color: theme.colors.primary,
    borderColor: "rgba(255,107,53,0.3)",
    backgroundColor: "rgba(255,107,53,0.1)",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // For tab bar
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    justifyContent: "center",
    width: "100%",
    maxWidth: 500,
    
  },
  modalCard: {
    maxHeight: "100%",
    padding: 0, // We control padding in content
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 0,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 24,
    marginTop: 16,
  },
  modalTime: {
    color: theme.colors.textMuted,
    fontSize: 13,
    paddingHorizontal: 24,
    marginTop: 6,
  },
  modalDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 24,
    marginVertical: 24,
  },
  transcriptionLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  transcriptionText: {
    color: theme.colors.textSecondary,
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  modalMetadata: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 14,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
});
