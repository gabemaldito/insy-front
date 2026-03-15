import { Search, X, Calendar, Hash, Edit2, Check } from "lucide-react-native";
import React, { useState, useEffect } from "react";
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
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { OrbBackground } from "../../components/ui/OrbBackground";
import { InsightCard } from "../../components/vault/InsightCard";
import { GlassCard } from "../../components/ui/GlassCard";
import { Tag } from "../../components/ui/Tag";
import { theme } from "../../constants/theme";
import { useInsyStore, VaultItem } from "../../store/useInsyStore";

const FILTERS = ["all", "idea", "task", "insight"] as const;

export default function VaultScreen() {
  const { vaultItems, selectedFilter, setFilter, updateVaultItem } = useInsyStore();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTranscription, setEditTranscription] = useState("");

  // Gesture state
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (selectedItem) {
      setEditTitle(selectedItem.title);
      setEditTranscription(selectedItem.transcription || selectedItem.desc);
      translateY.value = 0; // Reset position
    } else {
      setIsEditing(false);
    }
  }, [selectedItem]);

  const handleSave = () => {
    if (selectedItem) {
      updateVaultItem(selectedItem.id, {
        title: editTitle,
        transcription: editTranscription,
        desc: editTranscription.length > 50 ? editTranscription.substring(0, 47) + "..." : editTranscription
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsEditing(false);
      setSelectedItem({
        ...selectedItem,
        title: editTitle,
        transcription: editTranscription
      });
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Allow dragging down only
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150 || event.velocityY > 600) {
        // Close modal
        translateY.value = withTiming(800, {}, () => {
          runOnJS(setSelectedItem)(null);
        });
      } else {
        // Spring back
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
          
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContent}
              >
                <GlassCard style={styles.modalCard} intensity={40}>
                  {/* Drag Handle Indicator */}
                  <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                  </View>

                  <View style={styles.modalHeader}>
                    <View style={styles.headerLeft}>
                      <Tag type={selectedItem?.type || "idea"} />
                    </View>
                    
                    <View style={styles.headerRight}>
                      {isEditing ? (
                        <>
                          <Pressable 
                            onPress={() => {
                              setIsEditing(false);
                              setEditTitle(selectedItem?.title || "");
                              setEditTranscription(selectedItem?.transcription || selectedItem?.desc || "");
                            }}
                            style={[styles.actionButton, styles.cancelButton]}
                          >
                            <X color="#ff4444" size={18} />
                          </Pressable>
                          <Pressable 
                            onPress={handleSave}
                            style={[styles.actionButton, styles.saveButton]}
                          >
                            <Check color="#00ff88" size={18} />
                          </Pressable>
                        </>
                      ) : (
                        <Pressable 
                          onPress={() => {
                            setIsEditing(true);
                            Haptics.selectionAsync();
                          }}
                          style={styles.actionButton}
                        >
                          <Edit2 color="#ffffff" size={18} />
                        </Pressable>
                      )}
                      <View style={styles.headerDivider} />
                      <Pressable 
                        onPress={() => setSelectedItem(null)}
                        style={styles.closeButton}
                      >
                        <X color="#ffffff" size={20} />
                      </Pressable>
                    </View>
                  </View>

                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    {isEditing ? (
                      <View style={styles.editSection}>
                        <TextInput
                          style={styles.editTitleInput}
                          value={editTitle}
                          onChangeText={setEditTitle}
                          placeholder="Title"
                          placeholderTextColor="rgba(255,255,255,0.2)"
                          multiline
                        />
                        <Text style={styles.modalTime}>{selectedItem?.time}</Text>
                        <View style={styles.modalDivider} />
                        <Text style={styles.transcriptionLabel}>EDITING TRANSCRIPTION</Text>
                        <TextInput
                          style={styles.editTranscriptionInput}
                          value={editTranscription}
                          onChangeText={setEditTranscription}
                          placeholder="Transcription"
                          placeholderTextColor="rgba(255,255,255,0.2)"
                          multiline
                        />
                      </View>
                    ) : (
                      <View style={styles.viewSection}>
                        <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
                        <Text style={styles.modalTime}>{selectedItem?.time}</Text>
                        
                        <View style={styles.modalDivider} />
                        
                        <Text style={styles.transcriptionLabel}>TRANSCRIPTION</Text>
                        <Text style={styles.transcriptionText}>
                          {selectedItem?.transcription || selectedItem?.desc}
                        </Text>
                      </View>
                    )}

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
              </KeyboardAvoidingView>
            </Animated.View>
          </GestureDetector>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    width: "100%",
    height: "92%",
  },
  modalContent: {
    flex: 1,
  },
  modalCard: {
    flex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 0,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8, // Reduced since we have drag handle
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 4,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  saveButton: {
    backgroundColor: "rgba(0,255,136,0.08)",
    borderColor: "rgba(0,255,136,0.2)",
  },
  cancelButton: {
    backgroundColor: "rgba(255,68,68,0.08)",
    borderColor: "rgba(255,68,68,0.2)",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  viewSection: {},
  editSection: {},
  editTitleInput: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  editTranscriptionInput: {
    color: theme.colors.textSecondary,
    fontSize: 22,
    lineHeight: 32,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 24,
    marginBottom: 40,
    minHeight: 200,
    textAlignVertical: "top",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  modalTime: {
    color: theme.colors.textMuted,
    fontSize: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 24,
    marginVertical: 28,
  },
  transcriptionLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  transcriptionText: {
    color: theme.colors.textSecondary,
    fontSize: 22,
    lineHeight: 32,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  modalMetadata: {
    paddingHorizontal: 24,
    paddingBottom: 50,
    gap: 16,
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
