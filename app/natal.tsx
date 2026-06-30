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
import { colors, fonts } from "@/constants/theme";
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

  // Cancel any in-flight geocoding request on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const updateForm = (field: keyof FormState, value: string) => {
    // ✅ Resetta gli errori di validazione quando l'utente modifica il campo
    if (field === "day" || field === "year" || field === "month") {
      setDateError(null);
      setDateErrorField(null);
    }
    
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

  // ✅ Calcola canSubmit - SENZA validazione
  const canSubmit = Boolean(
    form.day && 
    form.year && 
    selectedLocation &&
    !isLoading
  );

  // ✅ Funzione di validazione - chiamata SOLO quando serve
  const validateForm = useCallback(() => {
    if (!form.day || !form.year || !selectedLocation) {
      return { valid: false, error: "Please fill in all required fields" };
    }

    const dateValidationError = validateNatalDate(
      form.day,
      form.month,
      form.year,
      currentYear,
    );

    if (dateValidationError) {
      return { 
        valid: false, 
        error: dateValidationError.message,
        field: dateValidationError.field 
      };
    }

    return { valid: true };
  }, [form.day, form.month, form.year, selectedLocation, currentYear]);

  // ✅ handleSubmit - validazione QUI
  const handleSubmit = useCallback(() => {
    if (!selectedLocation) return;
    Keyboard.dismiss();

    const validation = validateForm();
    
    if (!validation.valid) {
      if (validation.field === 'day' || validation.field === 'year') {
        setDateError(validation.error || null);
        setDateErrorField(validation.field || null);
      } else {
        setFormError(validation.error || null);
      }
      return;
    }

    // ✅ Reset errori prima di procedere
    setDateError(null);
    setDateErrorField(null);
    setFormError(null);
    setIsLoading(true);
    
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
  }, [form, selectedLocation, validateForm]);

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
                style={styles.newChartBtn}
              >
                <Text style={styles.newChartBtnText}>{headerRightLabel}</Text>
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
                    placeholderTextColor={colors.placeholder}
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
                    placeholderTextColor={colors.placeholder}
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
                    placeholderTextColor={colors.placeholder}
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
                    placeholderTextColor={colors.placeholder}
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
                    placeholderTextColor={colors.placeholder}
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
                  >
                    {locationError}
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

        {/* Bottom Sheet */}
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
                      color={colors.accentText}
                      aria-hidden={true}
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
  newChartBtnText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.accentMuted,
    textTransform: "uppercase",
  },
  newChartBtn:{
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentBorder,
    
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontFamily: fonts.serif,
    fontSize: 44,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 60,
    textAlign: "center",
  },
  fieldLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    letterSpacing: 3,
    color: colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 15,
  },
  optional: {
    color: colors.optional,
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
    borderBottomColor: colors.optional,
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.borderColor,
    height: 48,
  },
  inputSmall: {
    flex: 1,
    minWidth: 70,
    textAlign: "center",
    paddingVertical: 10,
  },
  inputError: {
    borderBottomColor: colors.error,
  },
  inputMonth: {
    flex: 1,
    justifyContent: "center",
    minWidth: 120,
  },
  inputText: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.borderColor,
  },
  inputPlaceholder: {
    fontFamily: fonts.serif,
    color: colors.placeholder,
    fontSize: 20,
  },
  colon: {
    fontFamily: fonts.serifLight,
    fontSize: 20,
    color: colors.optional,
  },
  searchIconBtn: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.dividerLight,
  },
  selectedLocation: {
    fontFamily: fonts.sans,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.accentMuted,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.error,
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
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.textSecondary,
  },
});