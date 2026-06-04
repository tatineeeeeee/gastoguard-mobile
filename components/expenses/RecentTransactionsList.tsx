import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";
import { TransactionRow } from "./TransactionRow";
import { SkeletonList } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ExpenseWithCategory } from "@/lib/types";

type Props = {
  limit?: number;
};

export function RecentTransactionsList({ limit = 5 }: Props) {
  const router = useRouter();
  const data = useQuery(api.expenses.getRecent, { limit });

  if (data === undefined) {
    return <SkeletonList count={limit} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon="💸"
        title="No transactions yet"
        subtitle="Tap the + button to add your first transaction."
        actionLabel="Add Expense"
        onAction={() => router.push("/(app)/add-expense")}
      />
    );
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 15,
            color: "#F8FAFC",
          }}
        >
          Recent Transactions
        </Text>
        <TouchableOpacity onPress={() => router.push("/(app)/expenses")}>
          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#10B981" }}>
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 8 }}>
        {(data as ExpenseWithCategory[]).map((tx) => (
          <TransactionRow
            key={tx._id}
            tx={tx}
            onPress={() => router.push(`/(app)/expense/${tx._id}`)}
          />
        ))}
      </View>
    </View>
  );
}
