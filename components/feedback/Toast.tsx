import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

export type ToastVariant = "success" | "error" | "info";

export type ToastAction = {
  label: string;
  onPress: () => void;
};

export type ToastData = {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
};

const VARIANT_COLOR: Record<ToastVariant, string> = {
  success: "#10B981",
  error: "#F43F5E",
  info: "#F59E0B",
};

type Props = {
  data: ToastData;
  translateY: SharedValue<number>;
  opacity: SharedValue<number>;
  onActionPress?: () => void;
};

export function Toast({ data, translateY, opacity, onActionPress }: Props) {
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#1E293B",
          borderRadius: 12,
          borderWidth: 1,
          borderLeftWidth: 4,
          borderColor: "#334155",
          borderLeftColor: VARIANT_COLOR[data.variant],
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 16,
          gap: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        animStyle,
      ]}
    >
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 14,
          color: "#F8FAFC",
          flex: 1,
        }}
      >
        {data.message}
      </Text>
      {data.action && (
        <TouchableOpacity
          onPress={onActionPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 13,
              color: VARIANT_COLOR[data.variant],
            }}
          >
            {data.action.label}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
