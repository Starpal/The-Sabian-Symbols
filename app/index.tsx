import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Star from "@/components/star";
import HomeButton from "@/components/ui/home-button";
import { router } from "expo-router";

const STARS = Array.from({ length: 80 }).map(() => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 0.5, // 0.5 → 2.5 px
}));

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
        <Text style={styles.title}>Sabian Symbols</Text>
        <Text style={styles.subtitle}>✧ 360 degrees of the zodiac ✧</Text>
      </FadeInView>

      <FadeInView delay={400}>
        <View style={styles.divider} />

        <HomeButton
          title="Search a Degree"
          icon="search-outline"
          onPress={
            () => router.push("/search")
          }
        />
        <HomeButton
          title="Natal Chart"
          icon="planet-outline"
          onPress={
            () => router.push("/natal")
          }
        />
        <HomeButton
          title="Ask the Oracle"
          icon="sparkles-outline"
          variant="primary"
          onPress={
            () => router.push("/")
            //random
          }
        />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c1a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 80,
  },
  star: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  title: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 82,
    color: "#ffffffd8",
    textAlign: "center",
    lineHeight: 74,
    marginBottom: 20,
    paddingTop: 10,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 3,
    color: "rgba(255, 255, 255, 0.31)",
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(228, 37, 37, 0.08)",
    marginBottom: 20,
  },
});
