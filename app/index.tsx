import Star from "@/components/Star";
import HomeButton from "@/components/ui/home-button";
import { STARS } from "@/constants/appConstants";
import { colors, fonts } from "@/constants/theme";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const FadeInView: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay, opacity]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {STARS.map((star, i) => (
        <Star
          key={i}
          top={star.top as any}
          left={star.left as any}
          size={star.size}
        />
      ))}

      <FadeInView delay={200}>
        <Text style={styles.title} accessibilityRole="header">
          Sabian Symbols
        </Text>
        <Text style={styles.subtitle}>✧ 360 degrees of the zodiac ✧</Text>
      </FadeInView>

      <FadeInView delay={400}>
        <View style={styles.divider} />

        <HomeButton
          title="Search a Degree"
          icon="search-outline"
          onPress={() => router.push("/search")}
        />
        <HomeButton
          title="Natal Chart"
          icon="planet-outline"
          onPress={() => router.push("/natal")}
        />
        <HomeButton
          title="Ask the Oracle"
          icon="sparkles-outline"
          variant="primary"
          onPress={() =>
            router.push({ pathname: "/results", params: { mode: "random" } })
          }
        />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  title: {
    fontFamily: fonts.serifMediumBold,
    fontSize: 82,
    color: colors.borderColor,
    textAlign: "center",
    lineHeight: 74,
    marginBottom: 20,
    paddingTop: 10,
  },
  subtitle: {
    fontFamily: fonts.sansRegular,
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 3,
    color: colors.textSecondary,
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(228, 37, 37, 0.08)",
    marginBottom: 60,
  },
});
