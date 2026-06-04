import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MoneyText } from "@/components/ui/MoneyText";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { BudgetWithSpending } from "@/lib/types";
import { BUDGET_PERIODS } from "@/lib/constants";

type Props = {
  budget: BudgetWithSpending;
  onDelete: (id: string) => void;
};

export const BudgetCard = memo(function BudgetCard({ budget, onDelete }: Props) {
  const cat = budget.category;
  const icon = cat?.icon ?? "💰";
  const name = cat?.name ?? "Overall";
  const color = cat?.color ?? "#10B981";
  const periodLabel = BUDGET_PERIODS.find((p) => p.value === budget.period)?.label ?? budget.period;
  const showWarning = budget.percentage >= 80 && budget.percentage < 100;
  const overBudget = budget.percentage >= 100;

  return (
    <View
      style={{
        backgroundColor: "#1E293B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: overBudget ? "#F43F5E40" : showWarning ? "#F59E0B40" : "#334155",
        padding: 16,
        gap: 12,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: color + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16 }}>{icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#F8FAFC" }}
              >
                {name}
              </Text>
              {(showWarning || overBudget) && (
                <View
                  style={{
                    backgroundColor: overBudget ? "#F43F5E20" : "#F59E0B20",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 10,
                      color: overBudget ? "#F43F5E" : "#F59E0B",
                    }}
                  >
                    {overBudget ? "Over budget" : "Near limit"}
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#94A3B8" }}>
              {periodLabel}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onDelete(budget._id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <ProgressBar percentage={budget.percentage} colorMode="budget" pulseAtFull />

      {/* Amounts */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MoneyText centavos={budget.spent} type="expense" size="sm" />
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#94A3B8" }}>
            {" "}spent
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#94A3B8" }}>
            limit{" "}
          </Text>
          <MoneyText centavos={budget.amount} type="neutral" size="sm" />
        </View>
      </View>

      {/* Percentage */}
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#94A3B8", textAlign: "right" }}>
        {Math.round(budget.percentage)}% used
      </Text>
    </View>
  );
});
