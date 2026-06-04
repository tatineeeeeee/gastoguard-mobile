import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
};

export function Card({ children, className, style, onPress, padding = 16 }: Props) {
  const base: ViewStyle = {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding,
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[base, style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[base, style]}>{children}</View>;
}
