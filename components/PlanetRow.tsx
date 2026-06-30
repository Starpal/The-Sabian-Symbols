import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlanetDegree } from "@/types/api";
import { colors } from "@/constants/theme";

type Props = Pick<PlanetDegree, "label" | "sign" | "signKey" | "degrees">;

const parseDegree = (raw: string): number => {
  const parts = raw.split(/[°"']/g).map(Number);
  const minutes = parts[2] > 30 ? parts[1] + 1 : parts[1];
  return minutes > 30 ? parts[0] + 1 : parts[0];
};

export default function PlanetRow({ label, sign, signKey, degrees }: Props) {
  const degree = useMemo(() => parseDegree(degrees), [degrees]);

  const handlePress = () => {
    router.push({
      pathname: "/results",
      params: { sign, degree, mode: "search" },
    });
  };

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityHint={`Navigate to ${label}, ${sign} at ${degrees}°`}
    >
      <Text style={styles.planet}>{label}</Text>
      <View style={styles.right}>
        <MaterialCommunityIcons
          name={`zodiac-${signKey}` as any}
          size={18}
          color={colors.accentMuted}
          aria-hidden={true}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <Text style={styles.degrees}>{degrees}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={14}
        color={colors.textDisabled}
        aria-hidden={true}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  planet: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 18,
    color: "rgba(255,255,255,0.75)",
    flex: 1,
    textTransform: "capitalize",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 12,
  },
  degrees: {
    fontFamily: "Inter_300Light",
    fontSize: 12,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.4)",
  },
});
