import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  variant?: "default" | "primary";
};

export default function OracleButton({
  title,
  icon,
  onPress,
  variant = "default",
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.btn, variant === "primary" && styles.btnPrimary]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={icon}
          size={24}
          color={
            variant === "primary"
              ? "rgba(200,185,240,0.8)"
              : "rgba(255, 255, 255, 0.8)"
          }
        />
      </View>

      <Text
        style={[styles.text, variant === "primary" && styles.textPrimary]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={styles.rightSpacer} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    maxWidth: 340,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 2,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.01)",
  },

  btnPrimary: {
    borderColor: "rgba(180,160,220,0.4)",
    marginTop: 25,
  },

  iconWrap: {
    width: 26,
    alignItems: "center",
  },

  rightSpacer: {
    width: 12,
  },

  text: {
    flex: 1,
    textAlign: "right",
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 29,
    letterSpacing: 2,
    color: "rgba(255, 255, 255, 0.9)",
  },

  textPrimary: {
    color: "rgba(200,185,240,0.97)",
  },
});
