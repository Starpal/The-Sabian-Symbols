import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
  const signs = SIGNS.filter((s) => s !== "Sign");
  const idx = signs.indexOf(current);
  if (direction === "plus") return idx === signs.length - 1 ? signs[0] : signs[idx + 1];
  return idx === 0 ? signs[signs.length - 1] : signs[idx - 1];
};

export default function ResultsScreen() {
  const { sign: initialSign, degree: initialDegree, mode } = useLocalSearchParams<{
    sign: string;
    degree: string;
    mode: Mode;
  }>();

  const [currentSign, setCurrentSign] = useState(initialSign ?? "");
  const [currentDegree, setCurrentDegree] = useState(Number(initialDegree) || 1);

  const isRandom = mode === "random" && !initialSign;

  const randomQuery = useRandomDegree();
  const searchQuery = useSearchDegree(currentSign, currentDegree);

  const { data: degree, isLoading, isError } = isRandom ? randomQuery : searchQuery;

  const navigate = (direction: "plus" | "minus") => {
    const sign = degree?.sign ?? currentSign;
    const deg = degree?.degree ?? currentDegree;

    let newDeg = direction === "plus" ? deg + 1 : deg - 1;
    let newSign = sign;

    if (newDeg > 30) {
      newDeg = 1;
      newSign = getNextSign(sign, "plus");
    } else if (newDeg < 1) {
      newDeg = 30;
      newSign = getNextSign(sign, "minus");
    }

    setCurrentSign(newSign);
    setCurrentDegree(newDeg);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={() => navigate("minus")}
            style={styles.navBtn}
            disabled={isLoading}
            hitSlop={12}>
            <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("plus")}
            style={styles.navBtn}
            disabled={isLoading}
            hitSlop={12}>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.4)" />
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
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 2,
  },
});