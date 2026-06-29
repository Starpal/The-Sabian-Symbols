import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import PlanetRow from "@/components/PlanetRow";
import { MONTHS } from "@/constants/appConstants";
import { fetchCoordinates } from "@/services/api";
import { Origin, Horoscope } from "circular-natal-horoscope-js";
import { LocationItem, PlanetDegree } from "@/types/api";

interface FormState {
  day: string;
  month: string;
  year: string;
  hour: string;
  minutes: string;
  location: string;
}

type SheetMode = "month" | "location";

const INITIAL_FORM: FormState = {
  day: "",
  month: "",
  year: "",
  hour: "",
  minutes: "",
  location: "",
};

export default function NatalScreen() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [locationResults, setLocationResults] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(
    null,
  );
  const [planetDegrees, setPlanetDegrees] = useState<PlanetDegree[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [sheetMode, setSheetMode] = useState<"month" | "location">("month");
  const snapPoints = useMemo(() => ["45%"], []);

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "location") {
      setSelectedLocation(null);
      setLocationResults([]);
    }
  };

  const handleLocationSearch = useCallback(async () => {
    if (!form.location.trim()) return;
    setIsLoadingLocations(true);
    try {
      const results = await fetchCoordinates(form.location);
      setLocationResults(results);
    } finally {
      setIsLoadingLocations(false);
    }
  }, [form.location]);

  const handleSelectLocation = useCallback((item: LocationItem) => {
    setSelectedLocation(item);
    setForm((prev) => ({ ...prev, location: item.name }));
    setLocationResults([]);
    setSheetMode("month");
    bottomSheetRef.current?.close();
  }, []);

  const canSubmit = form.day && form.year && selectedLocation;

  const handleSubmit = () => {
    if (!canSubmit || !selectedLocation) return;
    setIsLoading(true);
    try {
      const monthIndex = MONTHS.indexOf(form.month || "January");
      const hour = parseInt(form.hour || "12");
      const minute = parseInt(form.minutes || "0");

      const origin = new Origin({
        year: parseInt(form.year),
        month: monthIndex,
        date: parseInt(form.day),
        hour,
        minute,
        latitude: parseFloat(selectedLocation.lat),
        longitude: parseFloat(selectedLocation.lon),
      });

      const horoscope = new Horoscope({ origin, language: "en" });

      const celestialBodies = horoscope.CelestialBodies.all;
      const celestialPoints = horoscope.CelestialPoints.all;

      celestialPoints.forEach((point: any) => celestialBodies.push(point));
      celestialBodies.push(horoscope.Ascendant);
      celestialBodies.push(horoscope.Midheaven);

      const planets: PlanetDegree[] = celestialBodies
        .filter((el: any) => el.key !== "sirius" && el.key !== "southnode")
        .map((el: any) => ({
          key: el.key,
          label: el.label,
          sign: el.Sign?.label ?? "",
          signKey: el.Sign?.key ?? "",
          degrees: el.ChartPosition?.Ecliptic?.ArcDegreesFormatted30 ?? "",
        }));

      setPlanetDegrees(planets);
    } catch (e) {
      console.error("[handleSubmit]", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlanetDegrees(null);
    setForm(INITIAL_FORM);
    setSelectedLocation(null);
  };

  const locationResultName = locationResults.map((i) => i.name);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons
              name="arrow-back"
              size={20}
              color="rgba(200,185,240,0.97)"
            />
          </TouchableOpacity>
          {planetDegrees && (
            <TouchableOpacity onPress={handleReset} hitSlop={12}>
              <Text style={styles.resetText}>New chart</Text>
            </TouchableOpacity>
          )}
        </View>

        {!planetDegrees ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.screenTitle}>Natal chart</Text>

                {/* Date row */}
                <Text style={styles.fieldLabel}>Date of birth</Text>
                <View style={styles.dateRow}>
                  <TextInput
                    style={[styles.input, styles.inputSmall]}
                    placeholder="Day"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    keyboardType="numeric"
                    maxLength={2}
                    value={form.day}
                    onChangeText={(v) => updateForm("day", v)}
                  />
                  <TouchableOpacity
                    style={[styles.input, styles.inputMonth]}
                    onPress={() => {
                      Keyboard.dismiss();
                      bottomSheetRef.current?.expand();
                    }}
                  >
                    <Text
                      style={
                        form.month ? styles.inputText : styles.inputPlaceholder
                      }
                    >
                      {form.month || "Month"}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, styles.inputSmall]}
                    placeholder="Year"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    keyboardType="numeric"
                    maxLength={4}
                    value={form.year}
                    onChangeText={(v) => updateForm("year", v)}
                  />
                </View>

                {/* Time row */}
                <Text style={styles.fieldLabel}>
                  Time of birth <Text style={styles.optional}>(optional)</Text>
                </Text>
                <View style={styles.dateRow}>
                  <TextInput
                    style={[styles.input, styles.inputSmall]}
                    placeholder="Hour"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    keyboardType="numeric"
                    maxLength={2}
                    value={form.hour}
                    onChangeText={(v) => updateForm("hour", v)}
                  />
                  <Text style={styles.colon}>:</Text>
                  <TextInput
                    style={[styles.input, styles.inputSmall]}
                    placeholder="Min"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    keyboardType="numeric"
                    maxLength={2}
                    value={form.minutes}
                    onChangeText={(v) => updateForm("minutes", v)}
                  />
                </View>

                {/* Location */}
                <Text style={styles.fieldLabel}>Place of birth</Text>
                <View style={styles.locationRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="City, country"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    value={form.location}
                    onChangeText={(v) => updateForm("location", v)}
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                      handleLocationSearch();
                    }}
                    returnKeyType="search"
                  />
                  <TouchableOpacity
                    style={styles.searchIconBtn}
                    onPress={() => {
                      Keyboard.dismiss();
                      setSheetMode("location");
                      handleLocationSearch();
                    }}
                  >
                    {isLoadingLocations ? (
                      <ActivityIndicator
                        size="small"
                        color="rgba(200,185,240,0.6)"
                      />
                    ) : (
                      <Ionicons
                        name="search-outline"
                        size={16}
                        color="rgba(200,185,240,0.6)"
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {selectedLocation && (
                  <Text style={styles.selectedLocation} numberOfLines={1}>
                    ✓ {selectedLocation.name}
                  </Text>
                )}
                {locationResults.length > 0 && (
                  <View style={styles.locationList}>
                    {locationResults.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.locationItem}
                        onPress={() => handleSelectLocation(item)}
                        activeOpacity={0.6}
                      >
                        <Text style={styles.locationItemText} numberOfLines={2}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit || isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="rgba(200,185,240,0.8)" />
              ) : (
                <Text
                  style={[
                    styles.submitText,
                    !canSubmit && styles.submitTextDisabled,
                  ]}
                >
                  Calculate
                </Text>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        ) : (
          <>
            <Text style={styles.screenTitle}>Your degrees</Text>
            <Text style={styles.fieldLabel}>
              Tap a planet to see its Sabian symbol
            </Text>
            <FlatList
              data={planetDegrees}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <PlanetRow
                  label={item.label}
                  sign={item.sign}
                  signKey={item.signKey}
                  degrees={item.degrees}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            />
          </>
        )}

        {/* Bottom Sheet — month picker + location results */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={styles.sheetBg}
          handleIndicatorStyle={styles.sheetHandle}
        >
          <BottomSheetFlatList
            data={sheetMode === "location" ? locationResultName : MONTHS}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.sheetList}
            renderItem={({ item }) => {
              const isMonth = locationResults.length === 0;
              const isSelected = isMonth && item === form.month;
              return (
                <TouchableOpacity
                  style={[
                    styles.sheetItem,
                    isSelected && styles.sheetItemSelected,
                  ]}
                  onPress={() => {
                    if (isMonth) {
                      updateForm("month", item);
                      setSheetMode("month");
                      bottomSheetRef.current?.close();
                    } else {
                      const loc = locationResults.find((l) => l.name === item);
                      if (loc) handleSelectLocation(loc);
                    }
                  }}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.sheetItemText,
                      isSelected && styles.sheetItemTextSelected,
                    ]}
                  >
                    {item}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 8 : 0,
    paddingBottom: 16,
  },
  resetText: {
    fontFamily: "Inter_300Light",
    fontSize: 11,
    letterSpacing: 2,
    color: "rgba(200,185,240,0.6)",
    textTransform: "uppercase",
  },
  screenTitle: {
    fontFamily: "CormorantGaramond_300Light_Italic",
    fontSize: 44,
    color: "rgba(255,255,255,0.9)",
    marginTop: 20,
    marginBottom: 60,
    textAlign: "center",
  },
  fieldLabel: {
    fontFamily: "Inter_300Light",
    fontSize: 14,
    letterSpacing: 3,
    color: "rgba(255, 255, 255, 0.76)",
    textTransform: "uppercase",
    marginBottom: 15,
  },
  optional: {
    color: "rgba(255,255,255,0.30)",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 60,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.3)",
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 20,
    color: "rgba(255,255,255,0.85)",
    height: 48,
  },
  inputSmall: {
    flex: 1,
    minWidth: 70,
    textAlign: "center",
    paddingVertical: 10,
  },
  inputMonth: {
    flex: 1,
    justifyContent: "center",
    minWidth: 120,
  },
  inputText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
  },
  inputPlaceholder: {
    fontFamily: "CormorantGaramond_400Regular",
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 20,
  },
  colon: {
    fontFamily: "CormorantGaramond_300Light",
    fontSize: 20,
    color: "rgba(255,255,255,0.3)",
  },
  searchIconBtn: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  selectedLocation: {
    fontFamily: "Inter_300Light",
    fontSize: 10,
    letterSpacing: 1,
    color: "rgba(200,185,240,0.6)",
    marginBottom: 20,
  },
  locationList: {
    marginBottom: 16,
  },
  locationItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  locationItemText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
  },
  submitBtn: {
    width: "100%",
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(180,160,220,0.35)",
    borderRadius: 2,
    alignItems: "center",
  },
  submitBtnDisabled: {
    borderColor: "rgba(255,255,255,0.08)",
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
