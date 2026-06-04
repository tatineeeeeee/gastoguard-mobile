import React from "react";
import { View, Text } from "react-native";
import { MoneyText } from "@/components/ui/MoneyText";
import type { DebtSummary } from "@/lib/types";

type Props = {
  summary?: DebtSummary | null;
};

export function DebtSummaryHeader({ summary }: Props) {
  const net = summary?.net ?? 0;

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {/* Utang sa akin */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#1E293B",
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#10B98140",
          borderLeftWidth: 3,
          borderLeftColor: "#10B981",
          gap: 4,
        }}
      >
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: "#94A3B8" }}>
          OWED TO ME
        </Text>
        <MoneyText centavos={summary?.totalOwedToMe ?? 0} type="income" size="sm" />
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8" }}>
          {summary?.countOwedToMe ?? 0} person{(summary?.countOwedToMe ?? 0) !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Utang ko */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#1E293B",
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#F43F5E40",
          borderLeftWidth: 3,
          borderLeftColor: "#F43F5E",
          gap: 4,
        }}
      >
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: "#94A3B8" }}>
          I OWE
        </Text>
        <MoneyText centavos={summary?.totalIOwe ?? 0} type="expense" size="sm" />
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8" }}>
          {summary?.countIOwe ?? 0} person{(summary?.countIOwe ?? 0) !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Net */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#1E293B",
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: "#334155",
          gap: 4,
        }}
      >
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: "#94A3B8" }}>
          NET
        </Text>
        <MoneyText centavos={net} type={net >= 0 ? "income" : "expense"} size="sm" />
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8" }}>
          {net >= 0 ? "in your favor" : "you owe more"}
        </Text>
      </View>
    </View>
  );
}
