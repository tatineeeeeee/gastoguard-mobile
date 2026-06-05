import React from "react";
import { View, Text } from "react-native";
import { formatCurrency } from "@/lib/currency";

type Props = {
  activeCount: number;
  completedCount: number;
  totalSaved: number;
  totalTarget: number;
  overallProgress: number;
};

export function SavingsSummaryHeader({
  activeCount,
  completedCount,
  totalSaved,
  totalTarget,
  overallProgress,
}: Props) {
  const percentage = Math.round(overallProgress * 100);

  return (
    <View
      style={{
        backgroundColor: "#1E293B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#334155",
        padding: 16,
        gap: 12,
        marginBottom: 4,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text
          style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#94A3B8" }}
        >
          {activeCount} active goal{activeCount !== 1 ? "s" : ""}
          {completedCount > 0 ? ` · ${completedCount} completed` : ""}
        </Text>
        <Text
          style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 13, color: "#10B981" }}
        >
          {percentage}% overall
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text
            style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8", marginBottom: 2 }}
          >
            Total saved
          </Text>
          <Text
            style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 18, color: "#10B981" }}
          >
            {formatCurrency(totalSaved)}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8", marginBottom: 2 }}
          >
            Total target
          </Text>
          <Text
            style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 18, color: "#F8FAFC" }}
          >
            {formatCurrency(totalTarget)}
          </Text>
        </View>
      </View>

      {/* Overall progress bar */}
      <View
        style={{
          height: 6,
          backgroundColor: "#334155",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "#10B981",
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </View>
    </View>
  );
}
