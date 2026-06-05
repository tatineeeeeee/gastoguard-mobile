import React, { useState } from "react";
import { View, Text, LayoutChangeEvent } from "react-native";
import { formatCurrency } from "@/lib/currency";

type CategoryItem = {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  thisMonth: number;
  lastMonth: number;
};

type Props = { categories: CategoryItem[] };

const LABEL_WIDTH = 110;
const AMOUNT_WIDTH = 72;

export function CategoryBars({ categories }: Props) {
  const [chartWidth, setChartWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
  };

  const barMaxWidth = Math.max(0, chartWidth - LABEL_WIDTH - AMOUNT_WIDTH - 16);
  const maxAmount = Math.max(
    ...categories.map((c) => Math.max(c.thisMonth, c.lastMonth)),
    1
  );

  if (categories.length === 0) return null;

  return (
    <View onLayout={onLayout} style={{ gap: 14 }}>
      {/* Legend */}
      <View style={{ flexDirection: "row", gap: 16, paddingLeft: LABEL_WIDTH }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "#10B981" }} />
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8" }}>
            This month
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "#33415580" }} />
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8" }}>
            Last month
          </Text>
        </View>
      </View>

      {categories.map((cat) => {
        const thisW = barMaxWidth > 0 ? (cat.thisMonth / maxAmount) * barMaxWidth : 0;
        const lastW = barMaxWidth > 0 ? (cat.lastMonth / maxAmount) * barMaxWidth : 0;
        return (
          <View
            key={cat.categoryId}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            {/* Label */}
            <View style={{ width: LABEL_WIDTH, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: "#F8FAFC",
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </View>

            {/* Bars */}
            <View style={{ flex: 1, gap: 4 }}>
              <View
                style={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: cat.color || "#10B981",
                  width: Math.max(thisW, cat.thisMonth > 0 ? 4 : 0),
                  minWidth: cat.thisMonth > 0 ? 4 : 0,
                }}
              />
              <View
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: (cat.color || "#10B981") + "50",
                  width: Math.max(lastW, cat.lastMonth > 0 ? 4 : 0),
                  minWidth: cat.lastMonth > 0 ? 4 : 0,
                }}
              />
            </View>

            {/* Amount */}
            <View style={{ width: AMOUNT_WIDTH, alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: "JetBrainsMono_500Medium",
                  fontSize: 11,
                  color: "#F8FAFC",
                }}
              >
                {formatCurrency(cat.thisMonth)}
              </Text>
              {cat.lastMonth > 0 && (
                <Text
                  style={{
                    fontFamily: "JetBrainsMono_500Medium",
                    fontSize: 10,
                    color: "#94A3B8",
                  }}
                >
                  {formatCurrency(cat.lastMonth)}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
