import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

type ColorMode = "budget" | "debt" | "fixed";

function budgetColor(pct: number): string {
  if (pct >= 100) return "#F43F5E";
  if (pct >= 80) return "#F59E0B";
  return "#10B981";
}

function debtColor(pct: number): string {
  if (pct >= 80) return "#10B981";
  if (pct >= 40) return "#F59E0B";
  return "#F43F5E";
}

type Props = {
  percentage: number;
  colorMode?: ColorMode;
  fixedColor?: string;
  pulseAtFull?: boolean;
  height?: number;
};

export function ProgressBar({
  percentage,
  colorMode = "budget",
  fixedColor,
  pulseAtFull = true,
  height = 6,
}: Props) {
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const width = useSharedValue(0);
  const pulseOpacity = useSharedValue(1);

  let color: string;
  if (fixedColor) {
    color = fixedColor;
  } else if (colorMode === "debt") {
    color = debtColor(clamped);
  } else {
    color = budgetColor(clamped);
  }

  const shouldPulse = pulseAtFull && percentage >= 100;

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 600, easing: Easing.out(Easing.quad) });
  }, [clamped, width]);

  useEffect(() => {
    if (shouldPulse) {
      pulseOpacity.value = withRepeat(
        withTiming(0.4, { duration: 700 }),
        -1,
        true
      );
    } else {
      pulseOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [shouldPulse, pulseOpacity]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    opacity: pulseOpacity.value,
  }));

  return (
    <View
      style={{
        height,
        backgroundColor: "#334155",
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height,
            borderRadius: height / 2,
            backgroundColor: color,
          },
          barStyle,
        ]}
      />
    </View>
  );
}
