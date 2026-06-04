import React from "react";
import { Text, View } from "react-native";
import { formatAmountString } from "@/lib/amount";

type Props = {
  value: string;
  type?: "income" | "expense" | "neutral";
  placeholder?: string;
};

const COLOR_MAP = {
  income: "#10B981",
  expense: "#F43F5E",
  neutral: "#F8FAFC",
};

export function AmountDisplay({ value, type = "expense", placeholder = "0.00" }: Props) {
  const isEmpty = !value || value === "";
  const color = COLOR_MAP[type];
  const displayValue = isEmpty ? placeholder : formatAmountString(value);
  const displayColor = isEmpty ? "#334155" : color;

  return (
    <View style={{ alignItems: "center", paddingVertical: 12 }}>
      <Text
        style={{
          fontFamily: "JetBrainsMono_500Medium",
          fontSize: 42,
          color: displayColor,
          letterSpacing: -1,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        ₱{displayValue}
      </Text>
    </View>
  );
}
