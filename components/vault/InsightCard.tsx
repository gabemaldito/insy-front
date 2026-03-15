import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../../constants/theme";
import { VaultItem } from "../../store/useInsyStore";
import { GlassCard } from "../ui/GlassCard";
import { Tag } from "../ui/Tag";

interface InsightCardProps {
  item: VaultItem;
  index: number;
  onPress?: () => void;
}

export function InsightCard({ item, index, onPress }: InsightCardProps) {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.();
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
        <GlassCard style={styles.card}>
          <View style={styles.header}>
            <Tag type={item.type} />
            <Text style={styles.time}>{item.time}</Text>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>

          {(item.tags?.length || item.due) && (
            <>
              <View style={styles.divider} />
              <View style={styles.footer}>
                {item.due && (
                  <View style={styles.tagPill}>
                    <Text style={styles.tagText}>Due: {item.due}</Text>
                  </View>
                )}
                {item.tags?.map((tag) => (
                  <View key={tag} style={styles.tagPill}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  time: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  desc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagPill: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
});
