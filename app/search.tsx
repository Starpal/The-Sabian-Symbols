import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { SIGNS } from "@/constants/appConstants";

type PickerType = "sign" | "degree" | null;

const DEGREES = Array.from({ length: 30 }, (_, i) => String(i + 1));

export default function SearchScreen() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);
  const [activePicker, setActivePicker] = useState<PickerType>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["45%"], []);

  const openPicker = useCallback((type: PickerType) => {
    setActivePicker(type);
    bottomSheetRef.current?.expand();
  }, []);

  const closePicker = useCallback(() => {
    bottomSheetRef.current?.close();
    setActivePicker(null);
  }, []);

  const handleSelectSign = useCallback(
    (sign: string) => {
      setSelectedSign(sign);
      setSelectedDegree(null);
      closePicker();
    },
    [closePicker],
  );

  const handleSelectDegree = useCallback(
    (degree: string) => {
      setSelectedDegree(Number(degree));
      closePicker();
    },
    [closePicker],
  );

  const canSubmit = selectedSign && selectedDegree;

  const handleSubmit = () => {
    if (!canSubmit) return;
    router.push({
      pathname: "/results",
      params: { sign: selectedSign, degree: selectedDegree, mode: "search" },
    });
  };

  const signsData = SIGNS.filter((s) => s !== "Sign");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons
              name="arrow-back"
              size={20}
              color="rgba(200,185,240,0.97)"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.screenTitle}>Search a Degree</Text>

          {/* Sign picker field */}
          <Text style={styles.fieldLabel}>Zodiac sign</Text>
          <TouchableOpacity
            style={[styles.field, selectedSign && styles.fieldActive]}
            onPress={() => openPicker("sign")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.fieldValue,
                !selectedSign && styles.fieldPlaceholder,
              ]}
            >
              {selectedSign ?? "Select a sign"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={12}
              color="rgba(255,255,255,0.2)"
            />
          </TouchableOpacity>

          {/* Degree picker field */}
          <Text style={styles.fieldLabel}>Degree</Text>
          <TouchableOpacity
            style={[
              styles.field,
              selectedDegree !== null && styles.fieldActive,
            ]}
            onPress={() => openPicker("degree")}
            activeOpacity={0.7}
            disabled={!selectedSign}
          >
            <Text
              style={[
                styles.fieldValue,
                selectedDegree === null && styles.fieldPlaceholder,
              ]}
            >
              {selectedDegree !== null
                ? `${selectedDegree}°`
                : "Select a degree"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={12}
              color="rgba(255,255,255,0.2)"
            />
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={!canSubmit}
        >
          <Text
            style={[styles.submitText, !canSubmit && styles.submitTextDisabled]}
          >
            Search
          </Text>
        </TouchableOpacity>

        {/* Bottom Sheet Picker */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={() => setActivePicker(null)}
          backgroundStyle={styles.sheetBg}
          handleIndicatorStyle={styles.sheetHandle}
        >
          <BottomSheetFlatList
            data={activePicker === "sign" ? signsData : DEGREES}
            keyExtractor={(item) => item.toString()}
            contentContainerStyle={styles.sheetList}
            renderItem={({ item }) => {
              const isSign = activePicker === "sign";
              const isSelected = isSign
                ? item === selectedSign
                : item === String(selectedDegree);

              return (
                <TouchableOpacity
                  style={[
                    styles.sheetItem,
                    isSelected && styles.sheetItemSelected,
                  ]}
                  onPress={() =>
                    isSign
                      ? handleSelectSign(item as string)
                      : handleSelectDegree(item as string)
                  }
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.sheetItemText,
                      isSelected && styles.sheetItemTextSelected,
                    ]}
                  >
                    {isSign ? item : `${item}°`}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color="rgba(200,185,240,0.8)"
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c1a",
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: Platform.OS === "android" ? 8 : 0,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  screenTitle: {
    fontFamily: "CormorantGaramond_300Light_Italic",
    fontSize: 44,
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
    marginTop: 24,
    marginBottom: 80,
  },
  fieldLabel: {
    fontFamily: "Inter_300Light",
    fontSize: 14,
    letterSpacing: 3,
    color: "rgba(255, 255, 255, 0.76)",
    textTransform: "uppercase",
    marginBottom: 20,
  },
  field: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
    marginBottom: 70,
  },
  fieldActive: {
    borderBottomColor: "rgba(180,160,220,0.35)",
  },
  fieldValue: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 26,
    color: "rgba(255,255,255,0.85)",
  },
  fieldPlaceholder: {
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 20,
  },
  submitBtn: {
    width: "100%",
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(180,160,220,0.35)",
    borderRadius: 2,
    alignItems: "center",
    marginBottom: 24,
  },
  submitBtnDisabled: {
    borderColor: "rgba(180,160,220,0.4)",
  },
  submitText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 25,
    letterSpacing: 3,
    color: "rgba(200,185,240,0.85)",
  },
  submitTextDisabled: {
    color: "rgba(255,255,255,0.2)",
  },

  // Bottom Sheet
  sheetBg: {
    backgroundColor: "#13132a",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
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
