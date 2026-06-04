import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MoneyText } from "@/components/ui/MoneyText";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDueBadge } from "@/lib/dates";
import type { Doc } from "@/convex/_generated/dataModel";

const TONE_COLOR = {
  overdue: "#F43F5E",
  soon: "#F59E0B",
  normal: "#94A3B8",
};

type Props = {
  debt: Doc<"debts">;
  onPay: (debt: Doc<"debts">) => void;
  onSettle: (id: string) => void;
};

export const DebtCard = memo(function DebtCard({ debt, onPay, onSettle }: Props) {
  const remaining = debt.totalAmount - debt.paidAmount;
  const pct = debt.totalAmount > 0 ? (debt.paidAmount / debt.totalAmount) * 100 : 0;
  const due = debt.dueDate ? formatDueBadge(debt.dueDate) : null;
  const isOwedToMe = debt.type === "owed_to_me";

  return (
    <View
      style={{
        backgroundColor: "#1E293B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#334155",
        padding: 16,
        gap: 12,
      }}
    >
      {/* Top row */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#F8FAFC" }}>
              {debt.personName}
            </Text>
            <View
              style={{
                backgroundColor: isOwedToMe ? "#10B98120" : "#F43F5E20",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 10,
                  color: isOwedToMe ? "#10B981" : "#F43F5E",
                }}
              >
                {isOwedToMe ? "Utang sa Akin" : "Utang Ko"}
              </Text>
            </View>
          </View>
          {debt.description ? (
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: "#94A3B8" }}>
              {debt.description}
            </Text>
          ) : null}
          {due && (
            <View
              style={{
                backgroundColor: TONE_COLOR[due.tone] + "20",
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 11,
                  color: TONE_COLOR[due.tone],
                }}
              >
                {due.label}
              </Text>
            </View>
          )}
        </View>
        <View style={{ alignItems: "flex-end", gap: 2 }}>
          <MoneyText centavos={remaining} type={isOwedToMe ? "income" : "expense"} size="md" />
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8" }}>
            of{" "}
            <Text style={{ fontFamily: "JetBrainsMono_500Medium", color: "#94A3B8" }}>
              {(debt.totalAmount / 100).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
          </Text>
        </View>
      </View>

      {/* Progress */}
      <ProgressBar percentage={pct} colorMode="debt" height={5} />
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8" }}>
        {Math.round(pct)}% paid
      </Text>

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          onPress={() => onPay(debt)}
          style={{
            flex: 1,
            backgroundColor: "#10B98115",
            borderRadius: 10,
            padding: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#10B98140",
          }}
        >
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#10B981" }}>
            Add Payment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSettle(debt._id)}
          style={{
            flex: 1,
            backgroundColor: "#334155",
            borderRadius: 10,
            padding: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#94A3B8" }}>
            Settle ✓
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
