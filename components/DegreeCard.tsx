import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Degree } from "@/types/api";
import { colors, fonts } from "@/constants/theme";

type Props = Pick<
  Degree,
  "sign" | "degree" | "title" | "keynote" | "description"
>;

export default function DegreeCard({
  sign,
  degree,
  title,
  keynote,
  description,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.signRow}>
        <MaterialCommunityIcons
          name={`zodiac-${sign.toLowerCase()}` as any}
          size={36}
          color="rgba(200,185,240,0.9)"
          aria-hidden={true}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <Text style={styles.signLabel}>
          {sign} · {degree}°
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.keynote}>{keynote}</Text>

      <View style={styles.descriptionBox}>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  signRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  signLabel: {
    fontFamily: fonts.serifMediumBold,
    fontSize: 30,
    letterSpacing: 2,
    color: colors.accentText,
    textTransform: "uppercase",
  },
  divider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginBottom: 40,
  },
  title: {
    fontFamily: fonts.serifItalic,
    fontSize: 34,
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: 20,
    textAlign: "center",
  },
  keynote: {
    fontFamily: fonts.sans,
    fontSize: 17,
    letterSpacing: 2,
    color: colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 10,
    textAlign: "justify",
  },
  descriptionBox: {
    paddingVertical: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: 2,
  },
  description: {
    fontFamily: fonts.serifMedium,
    fontSize: 27,
    color: "rgba(255, 255, 255, 0.65)",
    lineHeight: 31,
    textAlign: "justify",
  },
});
