import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from "react-native";

type Variant = "primary" | "danger" | "ghost" | "surface";

const BG: Record<Variant, string> = {
  primary: "#10B981",
  danger: "#F43F5E20",
  ghost: "transparent",
  surface: "#1E293B",
};

const BORDER: Record<Variant, string> = {
  primary: "transparent",
  danger: "#F43F5E40",
  ghost: "transparent",
  surface: "#334155",
};

const TEXT_COLOR: Record<Variant, string> = {
  primary: "#FFFFFF",
  danger: "#F43F5E",
  ghost: "#94A3B8",
  surface: "#F8FAFC",
};

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  fontSize?: number;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  fontSize = 15,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: BG[variant],
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: BORDER[variant],
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? undefined : "flex-start",
          flexDirection: "row",
          gap: 8,
        },
        fullWidth && { width: "100%" } as ViewStyle,
        style,
      ]}
    >
      {loading && <ActivityIndicator size="small" color={TEXT_COLOR[variant]} />}
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize,
          color: TEXT_COLOR[variant],
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
