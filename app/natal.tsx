import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
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
import ScreenHeader from "@/components/ui/screen-header";
import PrimaryButton from "@/components/ui/primary-button";
import { MONTHS } from "@/constants/appConstants";
import { colors } from "@/constants/theme";
import { fetchCoordinates, ApiError } from "@/services/api";
import { computePlanetDegrees } from "@/services/astrology";
import { LocationItem, PlanetDegree } from "@/types/api";
import { validateNatalDate, sanitizeNumeric } from "@/utils/dateValidation";
import { sheetStyles } from "@/constants/sheetStyles";

interface FormState {
  day: string;
  month: string;
  year: string;
  hour: string;
  minutes: string;
  location: string;
}

const INITIAL_FORM: FormState = {
  day: "",
  month: "",
  year: "",
  hour: "",
  minutes: "",
  location: "",
};

const getErrorMessage = (error: unknown): string =>
  error instanceof ApiError
    ? error.message
    : "Couldn't reach the server. Please try again.";

export default function NatalScreen() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [showResults, setShowResults] = useState(false);
  const [locationResults, setLocationResults] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(
    null,
  );
  const [planetDegrees, setPlanetDegrees] = useState<PlanetDegree[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [dateErrorField, setDateErrorField] = useState<"day" | "year" | null>(
    null,
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const abortRef = useRef<AbortController | null>(null);

  const snapPoints = useMemo(() => ["45%"], []);

  // Cancel any in-flight geocoding request on unmount so a slow response
  // can't try to update state after the screen is gone.
  useEffect(() => () => abortRef.current?.abort(), []);

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "location") {
      setSelectedLocation(null);
      setLocationResults([]);
      setLocationError(null);
    }
  };

  const handleLocationSearch = useCallback(async () => {
    const query = form.location.trim();
    if (!query) return;

    // Cancel any previous request still in flight before starting a new one
    // — otherwise a slow first response can overwrite a faster later one.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoadingLocations(true);
    setLocationError(null);
    try {
      const results = await fetchCoordinates(query, controller.signal);
      setLocationResults(results);
      if (results.length === 0) {
        setLocationError("No places found. Try a different search.");
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setLocationError(getErrorMessage(error));
    } finally {
      if (!controller.signal.aborted) setIsLoadingLocations(false);
    }
  }, [form.location]);

  const handleSelectLocation = useCallback((item: LocationItem) => {
    setSelectedLocation(item);
    setForm((prev) => ({ ...prev, location: item.name }));
    setLocationResults([]);
    setLocationError(null);
  }, []);

  const currentYear = new Date().getFullYear();

  const dateValidationError = validateNatalDate(
    form.day,
    form.month,
    form.year,
    currentYear,
  );
  if (dateValidationError) {
    setDateError(dateValidationError.message);
    setDateErrorField(dateValidationError.field);
    return;
  }
  setDateError(null);
  setDateErrorField(null);

  const canSubmit = Boolean(form.day && form.year && selectedLocation);

  const handleSubmit = () => {
    if (!canSubmit || !selectedLocation) return;
    Keyboard.dismiss();

    const dateValidationError = validateNatalDate(
      form.day,
      form.month,
      form.year,
      currentYear,
    );

    if (dateValidationError) {
      setDateError(dateValidationError.message);
      setDateErrorField(dateValidationError.field);
      return;
    }
    setDateError(null);
    setDateErrorField(null);
    setIsLoading(true);
    setFormError(null);
    try {
      const monthIndex = MONTHS.indexOf(form.month || "January");
      const hour = parseInt(form.hour || "12", 10);
      const minute = parseInt(form.minutes || "0", 10);

      const planets = computePlanetDegrees({
        year: parseInt(form.year, 10),
        month: monthIndex,
        day: parseInt(form.day, 10),
        hour,
        minute,
        latitude: parseFloat(selectedLocation.lat),
        longitude: parseFloat(selectedLocation.lon),
      });

      setPlanetDegrees(planets);
      setShowResults(true);
    } catch (e) {
      console.error("[handleSubmit]", e);
      setFormError(
        "Couldn't calculate this chart. Double-check the date and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlanetDegrees(null);
    setForm(INITIAL_FORM);
    setSelectedLocation(null);
    setShowResults(false);
    setFormError(null);
    setDateError(null);
    setDateErrorField(null);
  };

  const headerRightLabel = "New Chart";
  const screenTitle = "Natal chart";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          onBack={showResults ? () => setShowResults(false) : undefined}
          right={
            showResults && (
              <TouchableOpacity
                onPress={handleReset}
                accessibilityLabel={headerRightLabel}
                accessibilityRole="button"
                accessibilityHint={`Navigate to ${screenTitle}`}
              >
                <Text style={styles.resetText}>{headerRightLabel}</Text>
              </TouchableOpacity>
            )
          }
        />

        {!showResults ? (
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
                <Text style={styles.screenTitle} accessibilityRole="header">
                  {screenTitle}
                </Text>

                {/* Date row */}
                <Text style={styles.fieldLabel}>Date of birth</Text>
                <View
                  style={[styles.dateRow, dateError && styles.dateRowWithError]}
                >
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputSmall,
                      dateErrorField === "day" && styles.inputError,
                    ]}
                    placeholder="Day"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    keyboardType="numeric"
                    maxLength={2}
                    value={form.day}
                    onChangeText={(v) => {
                      setDateError(null);
                      setDateErrorField(null);
                      updateForm(
                        "day",
                        sanitizeNumeric(v, { maxLength: 2, min: 1, max: 31 }),
                      );
                    }}
                    accessibilityLabel="Day of birth"
                    accessibilityHint={
                      dateError
                        ? `Invalid. ${dateError}`
                        : "Two digit day, between 1 and 31"
                    }
                  />
                  <TouchableOpacity
                    style={[styles.input, styles.inputMonth]}
                    onPress={() => {
                      Keyboard.dismiss();
                      bottomSheetRef.current?.expand();
                    }}
                    accessibilityLabel={form.month || "Month"}
                    accessibilityRole="button"
                    accessibilityHint={"Insert birthday Month"}
                    accessibilityState={{ expanded: false }}
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
                    style={[
                      styles.input,
                      styles.inputSmall,
                      dateErrorField === "year" && styles.inputError,
                    ]}
                    placeholder="Year"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    keyboardType="numeric"
                    maxLength={4}
                    value={form.year}
                    onChangeText={(v) => {
                      setDateError(null);
                      setDateErrorField(null);
                      updateForm("year", v.replace(/[^0-9]/g, "").slice(0, 4));
                    }}
                    accessibilityLabel="Year of birth"
                    accessibilityHint={
                      dateError ? `Invalid. ${dateError}` : "Four digit year"
                    }
                  />
                </View>
                {dateError && (
                  <Text
                    style={styles.errorText}
                    accessibilityLiveRegion="assertive"
                  >
                    {dateError}
                  </Text>
                )}

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
                    onChangeText={(v) =>
                      updateForm(
                        "hour",
                        sanitizeNumeric(v, { maxLength: 2, min: 0, max: 23 }),
                      )
                    }
                    accessibilityLabel="Hour of birth, optional"
                    accessibilityHint="24 hour format"
                  />
                  <Text style={styles.colon}>:</Text>
                  <TextInput
                    style={[styles.input, styles.inputSmall]}
                    placeholder="Min"
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    keyboardType="numeric"
                    maxLength={2}
                    value={form.minutes}
                    onChangeText={(v) =>
                      updateForm(
                        "minutes",
                        sanitizeNumeric(v, { maxLength: 2, min: 0, max: 59 }),
                      )
                    }
                    accessibilityLabel="Minute of birth, optional"
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
                    accessibilityLabel="Place of birth"
                    accessibilityHint="City and country, then search"
                  />
                  <TouchableOpacity
                    style={styles.searchIconBtn}
                    onPress={() => {
                      Keyboard.dismiss();
                      handleLocationSearch();
                    }}
                    accessibilityLabel={
                      isLoadingLocations ? "Searching" : "Search"
                    }
                    accessibilityRole="button"
                    accessibilityHint={"Search for location"}
                    accessibilityState={{ busy: isLoadingLocations }}
                  >
                    {isLoadingLocations ? (
                      <ActivityIndicator
                        size="small"
                        color={colors.accentMuted}
                      />
                    ) : (
                      <Ionicons
                        name="search-outline"
                        size={16}
                        color={colors.accentMuted}
                        aria-hidden={true}
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {selectedLocation && (
                  <Text
                    style={styles.selectedLocation}
                    numberOfLines={1}
                    accessibilityLiveRegion="polite"
                  >
                    ✓ {selectedLocation.name}
                  </Text>
                )}
                {locationError && (
                  <Text
                    style={styles.errorText}
                    accessibilityLiveRegion="assertive"
                  />
                )}
                {locationResults.length > 0 && (
                  <View style={styles.locationList}>
                    {locationResults.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.locationItem}
                        onPress={() => handleSelectLocation(item)}
                        activeOpacity={0.6}
                        accessibilityLabel={item.name}
                        accessibilityRole="button"
                        accessibilityHint={"Select Location item"}
                      >
                        <Text style={styles.locationItemText} numberOfLines={2}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {formError && (
                  <Text
                    style={[styles.errorText, { marginTop: 8 }]}
                    accessibilityLiveRegion="assertive"
                  >
                    {formError}
                  </Text>
                )}
              </View>
            </ScrollView>
            {/* Submit */}
            <PrimaryButton
              label="Calculate"
              toScreen="Your Natal Degrees"
              isLoading={isLoading}
              disabled={!canSubmit}
              onPress={handleSubmit}
            />
          </KeyboardAvoidingView>
        ) : (
          <>
            <Text style={styles.screenTitle} accessibilityRole="header">
              Your Natal Degrees
            </Text>
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

        {/* Bottom Sheet — month picker only. Location results render as an
            inline list above instead of inside the sheet, since both can't
            be visible/relevant at the same time and the inline list keeps
            the keyboard up for fast re-search. */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={sheetStyles.sheetBg}
          handleIndicatorStyle={sheetStyles.sheetHandle}
        >
          <BottomSheetFlatList
            data={MONTHS}
            keyExtractor={(item) => item}
            contentContainerStyle={sheetStyles.sheetList}
            renderItem={({ item }) => {
              const isSelected = item === form.month;
              return (
                <TouchableOpacity
                  style={[
                    sheetStyles.sheetItem,
                    isSelected && sheetStyles.sheetItemSelected,
                  ]}
                  onPress={() => {
                    updateForm("month", item);
                    bottomSheetRef.current?.close();
                  }}
                  activeOpacity={0.6}
                  accessibilityLabel={item}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      sheetStyles.sheetItemText,
                      isSelected && sheetStyles.sheetItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color="rgba(200,185,240,0.8)"
                      aria-hidden={true}
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants"
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
    backgroundColor: colors.bg,
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
    color: colors.accentMuted,
    textTransform: "uppercase",
  },
  screenTitle: {
    fontFamily: "CormorantGaramond_300Light_Italic",
    fontSize: 44,
    color: colors.textPrimary,
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
  dateRowWithError: {
    marginBottom: 10,
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
  inputError: {
    borderBottomColor: "#e08a8a",
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
    borderBottomColor: colors.dividerLight,
  },
  selectedLocation: {
    fontFamily: "Inter_300Light",
    fontSize: 10,
    letterSpacing: 1,
    color: colors.accentMuted,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: "Inter_300Light",
    fontSize: 12,
    letterSpacing: 0.5,
    color: "#e08a8a",
    marginBottom: 16,
  },
  locationList: {
    marginBottom: 16,
  },
  locationItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  locationItemText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
  },
});
