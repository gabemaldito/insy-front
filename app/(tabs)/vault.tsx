import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Calendar, Check, Edit2, Hash, Search, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "../../components/ui/GlassCard";
import { NoiseTexture } from "../../components/ui/NoiseTexture";
import { OrbBackground } from "../../components/ui/OrbBackground";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Tag } from "../../components/ui/Tag";
import { InsightCard } from "../../components/vault/InsightCard";
import { theme } from "../../constants/theme";
import { useInsyStore, VaultItem } from "../../store/useInsyStore";

const FILTERS = ["all", "idea", "task", "insight"] as const;

export default function VaultScreen() {
  const { vaultItems, selectedFilter, setFilter, updateVaultItem } =
    useInsyStore();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTranscription, setEditTranscription] = useState("");
  const [editType, setEditType] = useState("");
  const [editTypeColor, setEditTypeColor] = useState<string | undefined>(
    undefined,
  );
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editDue, setEditDue] = useState<string | undefined>(undefined);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isAddingNewType, setIsAddingNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");

  const DEFAULT_CATEGORIES = [
    { label: "Idea", color: "#FFCC00" },
    { label: "Task", color: "#3296FF" },
    { label: "Insight", color: "#34C759" },
    { label: "Important", color: "#FF4444" },
    { label: "Personal", color: "#AF52DE" },
  ];

  const scrollViewRef = useRef<ScrollView>(null);

  // Gesture state
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (selectedItem) {
      setEditTitle(selectedItem.title);
      setEditTranscription(selectedItem.transcription || selectedItem.desc);
      setEditType(selectedItem.type);
      setEditTypeColor(selectedItem.typeColor);
      setEditTags(selectedItem.tags || []);
      setEditDue(selectedItem.due);
      translateY.value = 0; // Reset position
    } else {
      setIsEditing(false);
      setShowTypeSelector(false);
      setIsAddingNewType(false);
      setNewTypeName("");
    }
  }, [selectedItem]);

  const handleSave = () => {
    if (selectedItem) {
      updateVaultItem(selectedItem.id, {
        title: editTitle,
        transcription: editTranscription,
        type: editType,
        typeColor: editTypeColor,
        tags: editTags,
        due: editType.toLowerCase() === "task" ? editDue : undefined,
        desc:
          editTranscription.length > 50
            ? editTranscription.substring(0, 47) + "..."
            : editTranscription,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsEditing(false);
      setSelectedItem({
        ...selectedItem,
        title: editTitle,
        transcription: editTranscription,
        type: editType,
        typeColor: editTypeColor,
        tags: editTags,
        due: editType.toLowerCase() === "task" ? editDue : undefined,
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
    Haptics.selectionAsync();
  };

  const handleTranscriptionChange = (text: string) => {
    // Detect hashtags pattern #word.
    // Matches # followed by word characters and terminated by a .
    const hashRegex = /#(\w+)\./g;
    const matches = Array.from(text.matchAll(hashRegex));

    if (matches.length > 0) {
      let filteredText = text;
      const discoveredTags: string[] = [];

      matches.forEach((match) => {
        const fullMatch = match[0];
        const tagName = match[1];
        discoveredTags.push(tagName);
        // Remove #word. from the text
        filteredText = filteredText.replace(fullMatch, "");
      });

      // Update states with filtered text
      setEditTranscription(filteredText);
      setEditTags((prev) => {
        const combined = [...prev, ...discoveredTags];
        return Array.from(new Set(combined));
      });

      // Haptic "pop" effect
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      setEditTranscription(text);
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
      <NoiseTexture />

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
          keyExtractor={(item, index) => item?.id ? item.id.toString() : `fallback-${index}`}
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
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSelectedItem(null)}
          />

          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContent}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
              >
                <GlassCard style={styles.modalCard} intensity={40}>
                  {/* Drag Handle Indicator */}
                  <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                  </View>

                  <View style={styles.modalHeader}>
                    <View style={styles.headerLeft}>
                      {isEditing ? (
                        <View>
                          <Pressable
                            onPress={() => {
                              setShowTypeSelector(!showTypeSelector);
                              Haptics.selectionAsync();
                            }}
                          >
                            <Tag type={editType} color={editTypeColor} />
                          </Pressable>

                          {showTypeSelector && (
                            <GlassCard
                              style={styles.typeSelector}
                              intensity={60}
                            >
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={
                                  styles.typeSelectorScroll
                                }
                              >
                                {DEFAULT_CATEGORIES.map((cat) => (
                                  <Pressable
                                    key={cat.label}
                                    onPress={() => {
                                      setEditType(cat.label);
                                      setEditTypeColor(cat.color);
                                      setShowTypeSelector(false);
                                      Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Light,
                                      );
                                    }}
                                    style={styles.typeOption}
                                  >
                                    <Tag type={cat.label} color={cat.color} />
                                  </Pressable>
                                ))}
                                {isAddingNewType ? (
                                  <View style={styles.addingTypeContainer}>
                                    <TextInput
                                      style={styles.newTypeInput}
                                      value={newTypeName}
                                      onChangeText={setNewTypeName}
                                      placeholder="Name..."
                                      placeholderTextColor="rgba(255,255,255,0.3)"
                                      autoFocus
                                      onSubmitEditing={() => {
                                        if (newTypeName) {
                                          setEditType(newTypeName);
                                          setEditTypeColor("#999999");
                                          setIsAddingNewType(false);
                                          setNewTypeName("");
                                          setShowTypeSelector(false);
                                        }
                                      }}
                                    />
                                    <Pressable
                                      onPress={() => setIsAddingNewType(false)}
                                      style={styles.cancelTypeBtn}
                                    >
                                      <X size={12} color="#ff4444" />
                                    </Pressable>
                                  </View>
                                ) : (
                                  <Pressable
                                    onPress={() => {
                                      setIsAddingNewType(true);
                                      Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Light,
                                      );
                                    }}
                                    style={styles.typeOption}
                                  >
                                    <View style={styles.addTypeButton}>
                                      <Text style={styles.addTypeText}>
                                        + NEW
                                      </Text>
                                    </View>
                                  </Pressable>
                                )}
                              </ScrollView>
                            </GlassCard>
                          )}
                        </View>
                      ) : (
                        <Tag
                          type={selectedItem?.type || "idea"}
                          color={selectedItem?.typeColor}
                        />
                      )}
                    </View>

                    <View style={styles.headerRight}>
                      {isEditing ? (
                        <>
                          <Pressable
                            onPress={() => {
                              setIsEditing(false);
                              setEditTitle(selectedItem?.title || "");
                              setEditTranscription(
                                selectedItem?.transcription ||
                                  selectedItem?.desc ||
                                  "",
                              );
                              setEditType(selectedItem?.type || "");
                              setEditTypeColor(selectedItem?.typeColor);
                              setEditTags(selectedItem?.tags || []);
                              setEditDue(selectedItem?.due);
                              setShowTypeSelector(false);
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
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.modalScrollContent}
                    onContentSizeChange={() => {
                      if (isEditing) {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }
                    }}
                  >
                    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
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
                          <Text style={styles.modalTime}>
                            {selectedItem?.time}
                          </Text>
                          <View style={styles.modalDivider} />
                          <Text style={styles.transcriptionLabel}>
                            EDITING TRANSCRIPTION
                          </Text>
                          <TextInput
                            style={styles.editTranscriptionInput}
                            value={editTranscription}
                            onChangeText={handleTranscriptionChange}
                            onFocus={() => {
                              setTimeout(() => {
                                scrollViewRef.current?.scrollToEnd({
                                  animated: true,
                                });
                              }, 100);
                            }}
                            placeholder="Transcription"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            multiline
                          />

                          {editType.toLowerCase() === "task" && (
                            <View style={styles.editDueContainer}>
                              <SectionLabel
                                label="DEADLINE"
                                style={{ marginBottom: 12 }}
                              />
                              <View style={styles.dueInputWrapper}>
                                <Calendar
                                  size={18}
                                  color={theme.colors.primary}
                                />
                                <TextInput
                                  style={styles.dueInput}
                                  value={editDue}
                                  onChangeText={setEditDue}
                                  placeholder="e.g. Tomorrow, 10am"
                                  placeholderTextColor="rgba(255,255,255,0.2)"
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View style={styles.viewSection}>
                          <Text style={styles.modalTitle}>
                            {selectedItem?.title}
                          </Text>
                          <Text style={styles.modalTime}>
                            {selectedItem?.time}
                          </Text>

                          <View style={styles.modalDivider} />

                          <Text style={styles.transcriptionLabel}>
                            TRANSCRIPTION
                          </Text>
                          <Text style={styles.transcriptionText}>
                            {selectedItem?.transcription || selectedItem?.desc}
                          </Text>
                        </View>
                      )}

                      {(isEditing
                        ? editTags.length > 0 ||
                          (editType.toLowerCase() === "task" && editDue)
                        : selectedItem?.tags?.length || selectedItem?.due) && (
                        <View style={styles.modalMetadata}>
                          {(isEditing
                            ? editType.toLowerCase() === "task" && editDue
                            : selectedItem?.due) && (
                            <View style={styles.metaRow}>
                              <Calendar
                                size={14}
                                color={theme.colors.textMuted}
                              />
                              <Text style={styles.metaText}>
                                Due: {isEditing ? editDue : selectedItem?.due}
                              </Text>
                            </View>
                          )}
                          <View style={styles.tagsContainer}>
                            {(isEditing
                              ? editTags
                              : selectedItem?.tags || []
                            ).map((tag) => (
                              <Pressable
                                key={tag}
                                style={styles.tagPill}
                                onPress={() => isEditing && removeTag(tag)}
                              >
                                <Hash
                                  size={12}
                                  color={theme.colors.textMuted}
                                />
                                <Text style={styles.tagText}>{tag}</Text>
                                {isEditing && (
                                  <View style={styles.removeTagIcon}>
                                    <X
                                      size={10}
                                      color="rgba(255,255,255,0.4)"
                                    />
                                  </View>
                                )}
                              </Pressable>
                            ))}
                          </View>
                        </View>
                      )}
                    </Pressable>
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
    fontSize: 22,
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
  modalScrollContent: {
    paddingBottom: 120, // Enough space to keep the cursor well above the keyboard
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
  // New Styles
  typeSelector: {
    position: "absolute",
    top: 36,
    left: 0,
    zIndex: 100,
    padding: 12,
    width: 280,
  },
  typeSelectorScroll: {
    gap: 8,
    paddingRight: 10,
  },
  typeOption: {
    marginRight: 4,
  },
  addTypeButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    height: 24,
  },
  addTypeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  tagText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  removeTagIcon: {
    marginLeft: 2,
    padding: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
  },
  addingTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  newTypeInput: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
    width: 60,
    padding: 0,
  },
  cancelTypeBtn: {
    marginLeft: 4,
  },
  editDueContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  dueInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 12,
  },
  dueInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
