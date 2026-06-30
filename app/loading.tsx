import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Star from "@/components/star";
import { STARS } from "@/constants/appConstants";

export default function LoadingScreen() {
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

useEffect(() => {
  Animated.loop(
    Animated.timing(rotation, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    })
  ).start();

  Animated.loop(
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
    ])
  ).start();
}, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {STARS.map((star, i) => (
          <Star
            key={i}
            top={star.top as any}
            left={star.left as any}
            size={star.size}
          />
        ))}
      </View>
      <Animated.View style={{ opacity, transform: [{ rotate }] }}>
        <Ionicons name="planet" size={52} color={colors.textPrimary} />
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
  },
  starsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
