import React, { useCallback } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/feedback/ToastProvider";
import type { BudgetWithSpending } from "@/lib/types";
import { TouchableOpacity } from "react-native";

function BudgetsContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { show } = useToast();
  const budgets = useQuery(api.budgets.getWithSpending, {});
  const removeBudget = useMutation(api.budgets.remove);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert("Delete Budget", "Remove this budget?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeBudget({ id: id as any });
            show({ message: "Budget removed", variant: "info" });
          },
        },
      ]);
    },
    [removeBudget, show]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 22, color: "#94A3B8" }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: "PlusJakartaSans_700Bold", fontSize: 24, color: "#F8FAFC" }}>
            Budgets
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(app)/budget/new")}
          style={{
            backgroundColor: "#10B981",
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 22, lineHeight: 28 }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {budgets === undefined ? (
        <View style={{ paddingHorizontal: 24, gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon="💰"
          title="No budgets yet"
          subtitle="Set a budget to control your spending."
          actionLabel="Add Budget"
          onAction={() => router.push("/(app)/budget/new")}
        />
      ) : (
        <FlatList
          data={budgets as BudgetWithSpending[]}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BudgetCard budget={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 4, gap: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

export default function BudgetsScreen() {
  return (
    <ErrorBoundary>
      <BudgetsContent />
    </ErrorBoundary>
  );
}
