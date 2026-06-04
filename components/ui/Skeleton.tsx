import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";

type Props = {
  width?: number | string;
  height?: number;
  rounded?: boolean;
  style?: ViewStyle;
};

export function Skeleton({ width = "100%", height = 16, rounded = false, style }: Props) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 800 }), -1, true);
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: width as ViewStyle["width"],
          height,
          backgroundColor: "#334155",
          borderRadius: rounded ? (height as number) / 2 : 8,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: "#1E293B",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#334155",
          padding: 16,
          gap: 12,
        },
        style,
      ]}
    >
      <Skeleton width="60%" height={14} />
      <Skeleton width="100%" height={10} />
      <Skeleton width="80%" height={10} />
    </View>
  );
}

export function SkeletonList({ count = 4, itemHeight = 64 }: { count?: number; itemHeight?: number }) {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            height: itemHeight,
            backgroundColor: "#1E293B",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#334155",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 12,
          }}
        >
          <Skeleton width={36} height={36} rounded />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="55%" height={12} />
            <Skeleton width="35%" height={10} />
          </View>
          <Skeleton width={64} height={14} />
        </View>
      ))}
    </View>
  );
}
