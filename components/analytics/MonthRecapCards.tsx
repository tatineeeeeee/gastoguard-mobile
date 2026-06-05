import React from "react";
import { View, Text } from "react-native";
import { MoneyText } from "@/components/ui/MoneyText";

type Recap = {
  totalIncome: number;
  totalExpenses: number;
  net: number;
  changePercent: number;
  dailyAverage: number;
  transactionCount: number;
  biggestExpense: { description: string; amount: number };
};

type Props = { recap: Recap };

function KpiCard({
  label,
  centavos,
  type,
  badge,
}: {
  label: string;
  centavos: number;
  type: "income" | "expense" | "neutral";
  badge?: React.ReactNode;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1E293B",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        padding: 12,
        gap: 4,
      }}
    >
      <Text
        style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8" }}
      >
        {label}
      </Text>
      <MoneyText centavos={centavos} type={type} size="sm" />
      {badge}
    </View>
  );
}

export function MonthRecapCards({ recap }: Props) {
  const changeAbs = Math.abs(recap.changePercent);
  const changeUp = recap.changePercent > 0;

  const changeBadge =
    changeAbs > 0 ? (
      <View
        style={{
          backgroundColor: changeUp ? "#F43F5E20" : "#10B98120",
          borderRadius: 4,
          paddingHorizontal: 6,
          paddingVertical: 2,
          alignSelf: "flex-start",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 10,
            color: changeUp ? "#F43F5E" : "#10B981",
          }}
        >
          {changeUp ? "↑" : "↓"} {changeAbs}% vs last month
        </Text>
      </View>
    ) : null;

  return (
    <View style={{ gap: 8 }}>
      {/* KPI row */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <KpiCard label="Income" centavos={recap.totalIncome} type="income" />
        <KpiCard
          label="Expenses"
          centavos={recap.totalExpenses}
          type="expense"
          badge={changeBadge}
        />
        <KpiCard
          label="Net"
          centavos={recap.net}
          type={recap.net >= 0 ? "income" : "expense"}
        />
      </View>

      {/* Stats row */}
      <View
        style={{
          backgroundColor: "#1E293B",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#334155",
          padding: 12,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8", marginBottom: 2 }}
          >
            Daily avg
          </Text>
          <MoneyText centavos={recap.dailyAverage} type="expense" size="sm" />
        </View>
        <View style={{ width: 1, backgroundColor: "#334155" }} />
        <View style={{ alignItems: "center" }}>
          <Text
            style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8", marginBottom: 2 }}
          >
            Transactions
          </Text>
          <Text
            style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 14, color: "#F8FAFC" }}
          >
            {recap.transactionCount}
          </Text>
        </View>
        {recap.biggestExpense.amount > 0 && (
          <>
            <View style={{ width: 1, backgroundColor: "#334155" }} />
            <View style={{ alignItems: "center", flex: 1, paddingLeft: 8 }}>
              <Text
                style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8", marginBottom: 2 }}
              >
                Biggest spend
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: "#F8FAFC",
                  numberOfLines: 1,
                }}
                numberOfLines={1}
              >
                {recap.biggestExpense.description || "—"}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
