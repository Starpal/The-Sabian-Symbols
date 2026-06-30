import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import DegreeCard from "@/components/DegreeCard";
import LoadingScreen from "@/app/loading";
import { SIGNS } from "@/constants/appConstants";
import { fetchDegreeBySignAndDegree, fetchRandomDegree } from "@/services/api";
import { colors } from "@/constants/theme";
import { Degree } from "@/types/api";
import PrimaryButton from "@/components/ui/primary-button";

type Mode = "search" | "random";

const getNextSign = (current: string, direction: "plus" | "minus"): string => {
  const idx = SIGNS.indexOf(current);
  if (direction === "plus")
    return idx === SIGNS.length - 1 ? SIGNS[0] : SIGNS[idx + 1];
  return idx === 0 ? SIGNS[SIGNS.length - 1] : SIGNS[idx - 1];
};

export default function ResultsScreen() {
  const {
    sign: initialSign,
    degree: initialDegree,
    mode,
  } = useLocalSearchParams<{ sign: string; degree: string; mode: Mode }>();

  const isRandom = mode === "random" && !initialSign;

  // for random — fetch once, store locally
  const [randomDegree, setRandomDegree] = useState<Degree | null>(null);
  const [randomLoading, setRandomLoading] = useState(isRandom);

  // for search/navigation — use tanstack cache
  const [searchSign, setSearchSign] = useState(initialSign ?? "");
  const [searchDegree, setSearchDegree] = useState(Number(initialDegree) || 0);
  const [searchEnabled, setSearchEnabled] = useState(!isRandom);

  const { data: searchResult, isFetching } = useQuery({
    queryKey: ["degree", "search", searchSign, searchDegree],
    queryFn: () => fetchDegreeBySignAndDegree(searchSign, searchDegree),
    enabled: searchEnabled && !!searchSign && !!searchDegree,
    staleTime: 1000 * 60 * 10,
  });

  // fetch random once on mount
  useEffect(() => {
    if (!isRandom) return;
    fetchRandomDegree()
      .then((data) => {
        const result = Array.isArray(data) ? data[0] : data;
        setRandomDegree(result);
        setSearchSign(result.sign);
        setSearchDegree(result.degree);
      })
      .finally(() => setRandomLoading(false));
  }, []);

  const degree = isRandom && !searchEnabled ? randomDegree : searchResult;
  const isLoading = isRandom && !searchEnabled ? randomLoading : isFetching;

  const navigate = useCallback(
    (direction: "plus" | "minus") => {
      let newDeg = direction === "plus" ? searchDegree + 1 : searchDegree - 1;
      let newSign = searchSign;

      if (newDeg > 30) {
        newDeg = 1;
        newSign = getNextSign(searchSign, "plus");
      } else if (newDeg < 1) {
        newDeg = 30;
        newSign = getNextSign(searchSign, "minus");
      }

      setSearchSign(newSign);
      setSearchDegree(newDeg);
      setSearchEnabled(true);
    },
    [searchSign, searchDegree],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={() => navigate("minus")}
            style={styles.navBtn}
            disabled={isLoading}
            hitSlop={12}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={isLoading ? colors.divider : colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("plus")}
            style={styles.navBtn}
            disabled={isLoading}
            hitSlop={12}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={isLoading ? colors.divider : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <LoadingScreen />
      ) : degree ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <DegreeCard
            sign={degree.sign}
            degree={degree.degree}
            title={degree.title}
            keynote={degree.keynote}
            description={degree.description}
          />
            <PrimaryButton label="Return" onPress={() => router.back()} />
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
    paddingBottom: 16,
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
});
