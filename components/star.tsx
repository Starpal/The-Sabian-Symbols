import React, { useEffect, useRef } from "react";
import { Animated, DimensionValue } from "react-native";

type StarProps = {
  top: DimensionValue;
  left: DimensionValue;
  size: number;
};

export default function Star({ top, left, size }: StarProps) {
  const opacity = useRef(new Animated.Value(Math.random() * 0.8 + 0.2)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = Math.random() * 3000;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 800 + Math.random() * 800,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 800 + Math.random() * 800,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: "white",
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}
