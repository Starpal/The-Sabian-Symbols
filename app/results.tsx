import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DegreeCard from "@/components/DegreeCard";
import LoadingScreen from "@/components/LoadingScreen";
import PrimaryButton from "@/components/ui/primary-button";
import { SIGNS } from "@/constants/appConstants";
import { colors, fonts } from "@/constants/theme";
import { useRandomDegree, useSearchDegree } from "@/hooks/use-degree";
import { ApiError } from "@/services/api";
import ScreenHeader from "@/components/ui/screen-header";

type Mode = "search" | "random";

const getNextSign = (current: string, direction: "plus" | "minus"): string => {
  const idx = SIGNS.indexOf(current);
  if (direction === "plus")
    return idx === SIGNS.length - 1 ? SIGNS[0] : SIGNS[idx + 1];
  return idx === 0 ? SIGNS[SIGNS.length - 1] : SIGNS[idx - 1];
};

const getErrorMessage = (error: unknown): string =>
  error instanceof ApiError
    ? error.message
    : "Something went wrong. Please try again.";

export default function ResultsScreen() {
  const {
    sign: initialSign,
    degree: initialDegree,
    mode,
  } = useLocalSearchParams<{ sign: string; degree: string; mode: Mode }>();

  const isRandomMode = mode === "random" && !initialSign;

  const router = useRouter();
  const params = useLocalSearchParams();
  const previousScreen = (params.from as string) || "Home";

  // Current sign/degree being displayed. For random mode this starts empty
  // and gets "seeded" once the random fetch resolves; from then on every
  // degree (including the random one) is read through the same search
  // query, so there's a single source of truth and a single cache.
  const [sign, setSign] = useState(initialSign ?? "");
  const [degree, setDegree] = useState(Number(initialDegree) || 0);
  const [seeded, setSeeded] = useState(!isRandomMode);

  const randomQuery = useRandomDegree(isRandomMode && !seeded);
  const searchQuery = useSearchDegree(sign, degree, seeded);

 useEffect(() => {
  if (!randomQuery.data || seeded) return;
  setSign(randomQuery.data.sign);
  setDegree(randomQuery.data.degree);
  setSeeded(true);
}, [randomQuery.data, seeded]);

const result = seeded
  ? (searchQuery.data ?? (isRandomMode ? randomQuery.data : undefined))
  : undefined;

const isLoading = seeded
  ? searchQuery.isFetching && !result
  : randomQuery.isLoading;

const isError = seeded ? searchQuery.isError : randomQuery.isError;
const error = seeded ? searchQuery.error : randomQuery.error;

  const navigate = useCallback(
    (direction: "plus" | "minus") => {
      let newDeg = direction === "plus" ? degree + 1 : degree - 1;
      let newSign = sign;

      if (newDeg > 30) {
        newDeg = 1;
        newSign = getNextSign(sign, "plus");
      } else if (newDeg < 1) {
        newDeg = 30;
        newSign = getNextSign(sign, "minus");
      }

      setSign(newSign);
      setDegree(newDeg);
    },
    [sign, degree],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader
          right={
            <View style={styles.navButtons}>
              <TouchableOpacity
                onPress={() => navigate("minus")}
                style={styles.navBtn}
                disabled={isLoading || !seeded}
                hitSlop={12}
                accessibilityLabel={"Previous degree"}
                accessibilityRole="button"
                accessibilityHint={"Navigate to previous degree"}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={
                    isLoading || !seeded ? colors.divider : colors.textSecondary
                  }
                  aria-hidden={true}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigate("plus")}
                style={styles.navBtn}
                disabled={isLoading || !seeded}
                hitSlop={12}
                accessibilityLabel={"Next degree"}
                accessibilityRole="button"
                accessibilityHint={"Navigate to next degree"}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    isLoading || !seeded ? colors.divider : colors.textSecondary
                  }
                  aria-hidden={true}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                />
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <View style={styles.centered}>
          <Ionicons
            name="alert-circle-outline"
            size={32}
            color={colors.textMuted}
            aria-hidden={true}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <Text style={styles.errorText} accessibilityLiveRegion="assertive">
            {getErrorMessage(error)}
          </Text>
          <PrimaryButton
            label="Try again"
            onPress={() =>
              seeded ? searchQuery.refetch() : randomQuery.refetch()
            }
            style={styles.retryBtn}
          />
        </View>
      ) : result ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <DegreeCard
            sign={result.sign}
            degree={result.degree}
            title={result.title}
            keynote={result.keynote}
            description={result.description}
          />
          <View style={styles.returnBtnWrapper}>
            <PrimaryButton
              label="Return"
              onPress={() => router.back()}
              toScreen={previousScreen}
            />
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
  navButtons: {
    flexDirection: "row",
    gap: 4,
  },
  navBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.borderColor,
    textAlign: "center",
  },
  retryBtn: {
    width: "auto",
    paddingHorizontal: 32,
    marginBottom: 0,
  },
  returnBtnWrapper: {
    marginTop: 30,
    paddingHorizontal: 24,
  },
});
