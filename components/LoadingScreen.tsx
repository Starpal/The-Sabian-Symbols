import Star from "@/components/Star";
import { STARS } from "@/constants/appConstants";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function LoadingScreen() {
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }),
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    spin.start();
    pulse.start();

    // Stop animations on unmount instead of letting them run against a
    // detached node — avoids the classic "Animated: useNativeDriver..."
    // warning spam when this screen unmounts mid-loop.
    return () => {
      spin.stop();
      pulse.stop();
    };
  }, [opacity, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="text"
      accessibilityLabel="Loading"
      accessibilityLiveRegion="polite"
    >
      <View
        style={styles.starsContainer}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {STARS.map((star, i) => (
          <Star
            key={i}
            top={star.top as any}
            left={star.left as any}
            size={star.size}
          />
        ))}
      </View>
      <Animated.View
        style={{ opacity, transform: [{ rotate }] }}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <Ionicons
          name="planet"
          size={52}
          color={colors.textPrimary}
          aria-hidden={true}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  starsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
