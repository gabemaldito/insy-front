import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";

interface SettingsRowProps extends ViewProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconBorderColor?: string;
  label: string;
  rightElement?: React.ReactNode;
  hideChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
  textColor?: string;
  containerStyle?: object;
}

export function SettingsRow({
  icon,
  iconBgColor,
  iconBorderColor,
  label,
  rightElement,
  hideChevron = false,
  onPress,
  isLast = false,
  textColor = "rgba(255,255,255,0.75)",
  containerStyle,
}: SettingsRowProps) {
  const innerContent = (
    <View style={[styles.row, !isLast && styles.borderBottom, containerStyle]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconBgColor },
          iconBorderColor
            ? { borderWidth: 1, borderColor: iconBorderColor }
            : null,
        ]}
      >
        {icon}
      </View>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>

      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}

      {!hideChevron && (
        <ChevronRight color="rgba(255,255,255,0.20)" size={16} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {innerContent}
      </TouchableOpacity>
    );
  }

  return innerContent;
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  rightElement: {
    flexDirection: "row",
    alignItems: "center",
  },
});
