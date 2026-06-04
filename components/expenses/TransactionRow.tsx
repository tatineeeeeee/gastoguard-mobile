import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MoneyText } from "@/components/ui/MoneyText";
import { formatRelativeDate } from "@/lib/dates";
import type { ExpenseWithCategory } from "@/lib/types";

type Props = {
  tx: ExpenseWithCategory;
  onPress?: () => void;
  onLongPress?: () => void;
};

export const TransactionRow = memo(function TransactionRow({ tx, onPress, onLongPress }: Props) {
  const cat = tx.category;
  const color = cat?.color ?? "#94A3B8";
  const icon = cat?.icon ?? "📦";
  const name = cat?.name ?? "Uncategorized";

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E293B",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        padding: 14,
        gap: 12,
      }}
    >
      {/* Category icon bubble */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color + "20",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>

      {/* Description + date */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 14,
            color: "#F8FAFC",
          }}
          numberOfLines={1}
        >
          {tx.description}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#94A3B8" }}>
          {name} · {formatRelativeDate(tx.date)}
        </Text>
      </View>

      {/* Amount */}
      <MoneyText
        centavos={tx.amount}
        type={tx.type === "income" ? "income" : "expense"}
        size="sm"
        signed
      />
    </TouchableOpacity>
  );
});
