import React from "react";
import { Text, TextStyle } from "react-native";
import { formatCurrency } from "@/lib/currency";

type MoneySize = "xs" | "sm" | "md" | "lg" | "xl";
type MoneyType = "income" | "expense" | "neutral";

const SIZE_MAP: Record<MoneySize, number> = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
};

const COLOR_MAP: Record<MoneyType, string> = {
  income: "#10B981",
  expense: "#F43F5E",
  neutral: "#F8FAFC",
};

type Props = {
  centavos: number;
  type?: MoneyType;
  size?: MoneySize;
  currency?: string;
  signed?: boolean;
  style?: TextStyle;
};

export function MoneyText({
  centavos,
  type = "neutral",
  size = "md",
  currency = "PHP",
  signed = false,
  style,
}: Props) {
  const formatted = formatCurrency(Math.abs(centavos), currency);
  const prefix = signed ? (centavos >= 0 ? "+" : "-") : "";

  return (
    <Text
      style={[
        {
          fontFamily: "JetBrainsMono_500Medium",
          fontSize: SIZE_MAP[size],
          color: COLOR_MAP[type],
        },
        style,
      ]}
    >
      {prefix}
      {formatted}
    </Text>
  );
}
