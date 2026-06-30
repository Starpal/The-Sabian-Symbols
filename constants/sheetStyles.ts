import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

// Shared by every screen that renders a @gorhom/bottom-sheet picker
// (search.tsx, natal.tsx) — was duplicated identically in both.
export const sheetStyles = StyleSheet.create({
  sheetBg: {
    backgroundColor: colors.bgSheet,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderColor,
  },
  sheetHandle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: 32,
  },
  sheetList: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sheetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  sheetItemSelected: {
    borderBottomColor: "rgba(180,160,220,0.1)",
  },
  sheetItemText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 20,
    color: "rgba(255,255,255,0.5)",
  },
  sheetItemTextSelected: {
    color: "rgba(200,185,240,0.9)",
  },
});