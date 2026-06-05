import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency";

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  goal: Doc<"savingsGoals">;
  onContribute: (goal: Doc<"savingsGoals">) => void;
  onWithdraw: (goal: Doc<"savingsGoals">) => void;
  onDelete: (id: string) => void;
};

function DeadlineBadge({ deadline }: { deadline: number }) {
  const now = Date.now();
  const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;
  const isSoon = daysLeft >= 0 && daysLeft <= 7;

  const color = isOverdue ? "#F43F5E" : isSoon ? "#F59E0B" : "#94A3B8";
  const bg = isOverdue ? "#F43F5E20" : isSoon ? "#F59E0B20" : "#94A3B820";
  const label = isOverdue
    ? "Overdue"
    : daysLeft === 0
    ? "Due today"
    : `${daysLeft}d left`;

  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color }}>
        {label}
      </Text>
    </View>
  );
}

export const SavingsGoalCard = memo(function SavingsGoalCard({
  goal,
  onContribute,
  onWithdraw,
  onDelete,
}: Props) {
  const progress = goal.targetAmount > 0 ? goal.savedAmount / goal.targetAmount : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const dashOffset = CIRCUMFERENCE * (1 - clampedProgress);
  const percentage = Math.round(clampedProgress * 100);
  const ringColor = goal.isCompleted ? "#10B981" : (goal.color ?? "#10B981");

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
      {/* Top row: icon + info + ring */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {/* Icon + name + badges */}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 32 }}>{goal.icon}</Text>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: "#F8FAFC",
            }}
            numberOfLines={1}
          >
            {goal.name}
          </Text>
          {goal.isCompleted && (
            <View
              style={{
                backgroundColor: "#10B98120",
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 3,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{ fontFamily: "Inter_500Medium", fontSize: 11, color: "#10B981" }}
              >
                Completed!
              </Text>
            </View>
          )}
          {!goal.isCompleted && goal.deadline && (
            <DeadlineBadge deadline={goal.deadline} />
          )}
        </View>

        {/* SVG Circular Ring */}
        <Svg width={100} height={100}>
          {/* Track */}
          <Circle
            cx={50}
            cy={50}
            r={RADIUS}
            stroke="#334155"
            strokeWidth={8}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={50}
            cy={50}
            r={RADIUS}
            stroke={ringColor}
            strokeWidth={8}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation={-90}
            origin="50, 50"
          />
          {/* Percentage label */}
          <SvgText
            x={50}
            y={46}
            textAnchor="middle"
            fontSize={16}
            fontWeight="600"
            fill="#F8FAFC"
          >
            {percentage}%
          </SvgText>
          <SvgText
            x={50}
            y={62}
            textAnchor="middle"
            fontSize={10}
            fill="#94A3B8"
          >
            saved
          </SvgText>
        </Svg>
      </View>

      {/* Amounts row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#0F172A",
          borderRadius: 10,
          padding: 12,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
            Saved
          </Text>
          <Text
            style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 14, color: "#10B981" }}
          >
            {formatCurrency(goal.savedAmount)}
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: "#334155" }} />
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
            Target
          </Text>
          <Text
            style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 14, color: "#F8FAFC" }}
          >
            {formatCurrency(goal.targetAmount)}
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: "#334155" }} />
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
            Remaining
          </Text>
          <Text
            style={{
              fontFamily: "JetBrainsMono_500Medium",
              fontSize: 14,
              color: goal.isCompleted ? "#10B981" : "#F8FAFC",
            }}
          >
            {goal.isCompleted ? "Done!" : formatCurrency(goal.targetAmount - goal.savedAmount)}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      {!goal.isCompleted && (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => onContribute(goal)}
            style={{
              flex: 1,
              backgroundColor: "#10B98115",
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#10B98140",
            }}
          >
            <Text
              style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#10B981" }}
            >
              Add ₱
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onWithdraw(goal)}
            style={{
              flex: 1,
              backgroundColor: "#334155",
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#94A3B8" }}
            >
              Withdraw
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(goal._id)}
            style={{
              backgroundColor: "#F43F5E15",
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#F43F5E30",
            }}
          >
            <Text style={{ fontSize: 14 }}>🗑</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});
