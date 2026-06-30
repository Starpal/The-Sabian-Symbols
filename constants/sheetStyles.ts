import { StyleSheet } from "react-native";
import { colors, fonts } from "@/constants/theme";

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
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textDisabled,
  },
  sheetItemSelected: {
    borderBottomColor: "rgba(180,160,220,0.1)",
  },
  sheetItemText: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.textSecondary,
  },
  sheetItemTextSelected: {
    color: colors.accentText,
  },
});
