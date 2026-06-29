import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DegreeCard from "@/components/DegreeCard";
import { SIGNS } from "@/constants/appConstants";
import { useRandomDegree, useSearchDegree } from "@/hooks/use-degree";
import { colors } from "@/constants/theme";

type Mode = "search" | "random";

const getNextSign = (current: string, direction: "plus" | "minus"): string => {
  const idx = SIGNS.indexOf(current);
  if (direction === "plus")
    return idx === SIGNS.length - 1 ? SIGNS[0] : SIGNS[idx + 1];
  return idx === 0 ? SIGNS[SIGNS.length - 1] : SIGNS[idx - 1];
};

export default function ResultsScreen() {
  const { sign: initialSign, degree: initialDegree, mode } =
    useLocalSearchParams<{ sign: string; degree: string; mode: Mode }>();

  // after random resolves, we switch to search mode with real sign/degree
  const [searchSign, setSearchSign] = useState(initialSign ?? "");
  const [searchDegree, setSearchDegree] = useState(Number(initialDegree) || 0);
  const [useSearch, setUseSearch] = useState(mode !== "random" || !!initialSign);

  const randomQuery = useRandomDegree();
  const searchQuery = useSearchDegree(searchSign, searchDegree);

  const { data: degree, isLoading, isError } = useSearch ? searchQuery : randomQuery;

  // once random resolves, switch to search mode so arrows work correctly
  useEffect(() => {
    if (!useSearch && degree) {
      setSearchSign(degree.sign);
      setSearchDegree(degree.degree);
      setUseSearch(true);
    }
  }, [degree, useSearch]);

  const navigate = (direction: "plus" | "minus") => {
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={20} color={colors.accent} />
        </TouchableOpacity>
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={() => navigate("minus")}
            style={styles.navBtn}
            disabled={isLoading || !useSearch}
            hitSlop={12}>
            <Ionicons
              name="chevron-back"
              size={18}
              color={isLoading || !useSearch ? colors.divider : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("plus")}
            style={styles.navBtn}
            disabled={isLoading || !useSearch}
            hitSlop={12}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={isLoading || !useSearch ? colors.divider : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accentMuted} />
        </View>
      ) : isError ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Something went wrong.</Text>
        </View>
      ) : degree ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <DegreeCard
            sign={degree.sign}
            degree={degree.degree}
            title={degree.title}
            keynote={degree.keynote}
            description={degree.description}
          />
          <TouchableOpacity style={styles.homeLink} onPress={() => router.back()}>
            <Text style={styles.homeLinkText}>Return</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 48,
  },
  homeLink: {
    width: "80%",
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentBorder,
    borderRadius: 2,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  homeLinkText: {
    textTransform: "uppercase",
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 25,
    letterSpacing: 3,
    color: colors.accent,
  },
  errorText: {
    fontFamily: "Inter_300Light",
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 2,
  },
});