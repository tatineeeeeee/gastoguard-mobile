import React from "react";
import { View, Text } from "react-native";

type Insight = {
  type: string;
  message: string;
  value?: number;
};

type Props = {
  insights: Insight[];
  streak: number;
  longestStreak: number;
};

const INSIGHT_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: "#10B98115", border: "#10B981", text: "#10B981", icon: "✅" },
  warning: { bg: "#F59E0B15", border: "#F59E0B", text: "#F59E0B", icon: "⚠️" },
  info: { bg: "#3B82F615", border: "#3B82F6", text: "#3B82F6", icon: "ℹ️" },
};

export function InsightsSection({ insights, streak, longestStreak }: Props) {
  return (
    <View style={{ gap: 10 }}>
      {/* Streak chips */}
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <View
          style={{
            backgroundColor: "#F59E0B20",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 16 }}>🔥</Text>
          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#F59E0B" }}
          >
            {streak} day streak
          </Text>
        </View>
        {longestStreak > streak && (
          <View
            style={{
              backgroundColor: "#94A3B820",
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 16 }}>🏆</Text>
            <Text
              style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#94A3B8" }}
            >
              Best: {longestStreak} days
            </Text>
          </View>
        )}
      </View>

      {/* Insight cards */}
      {insights.length === 0 ? (
        <View
          style={{
            backgroundColor: "#1E293B",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#334155",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#94A3B8",
              textAlign: "center",
            }}
          >
            Add more transactions to see personalized insights.
          </Text>
        </View>
      ) : (
        insights.map((insight, i) => {
          const style = INSIGHT_COLORS[insight.type] ?? INSIGHT_COLORS.info;
          return (
            <View
              key={i}
              style={{
                backgroundColor: style.bg,
                borderRadius: 12,
                padding: 14,
                borderLeftWidth: 3,
                borderLeftColor: style.border,
                borderWidth: 1,
                borderColor: "#334155",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 18 }}>{style.icon}</Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#F8FAFC",
                  flex: 1,
                  lineHeight: 20,
                }}
              >
                {insight.message}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
}
