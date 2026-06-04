import React from "react";
import { View, Text } from "react-native";
import { MoneyText } from "@/components/ui/MoneyText";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { ExpenseSummary } from "@/lib/types";

type Props = {
  summary?: ExpenseSummary | null;
  loading?: boolean;
};

export function KpiCards({ summary, loading }: Props) {
  if (loading || summary === undefined) {
    return (
      <View style={{ flexDirection: "row", gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flex: 1 }}>
            <SkeletonCard style={{ padding: 12 }} />
          </View>
        ))}
      </View>
    );
  }

  const cards = [
    {
      label: "Income",
      centavos: summary?.totalIncome ?? 0,
      type: "income" as const,
    },
    {
      label: "Expenses",
      centavos: summary?.totalExpenses ?? 0,
      type: "expense" as const,
    },
    {
      label: "Balance",
      centavos: summary?.balance ?? 0,
      type:
        (summary?.balance ?? 0) >= 0
          ? ("income" as const)
          : ("expense" as const),
    },
  ];

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      {cards.map((card) => (
        <View
          key={card.label}
          style={{
            flex: 1,
            backgroundColor: "#1E293B",
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: "#334155",
            gap: 6,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 10,
              color: "#94A3B8",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {card.label}
          </Text>
          <MoneyText centavos={card.centavos} type={card.type} size="sm" />
        </View>
      ))}
    </View>
  );
}
