import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export type ToggleOption = {
  value: string;
  label: string;
  activeColor?: string;
};

type Props = {
  options: ToggleOption[];
  value: string;
  onChange: (v: string) => void;
  fullWidth?: boolean;
};

export function SegmentedToggle({ options, value, onChange, fullWidth = true }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#0F172A",
        borderRadius: 10,
        padding: 3,
        gap: 2,
        alignSelf: fullWidth ? "stretch" : "flex-start",
      }}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        const activeColor = opt.activeColor ?? "#10B981";
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            style={{
              flex: fullWidth ? 1 : undefined,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor: isActive ? activeColor + "20" : "transparent",
              borderWidth: 1,
              borderColor: isActive ? activeColor + "50" : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: isActive ? activeColor : "#94A3B8",
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
