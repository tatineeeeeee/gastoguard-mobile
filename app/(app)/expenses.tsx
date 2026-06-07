import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePaginatedQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";
import { ExpenseListItem } from "@/components/expenses/ExpenseListItem";
import { FilterBar } from "@/components/expenses/FilterBar";
import { SkeletonList } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/feedback/ToastProvider";
import type { ExpenseWithCategory } from "@/lib/types";
import type { Id } from "@/convex/_generated/dataModel";

type FilterValue = "all" | "income" | "expense";

function ExpensesContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { show } = useToast();
  const [filter, setFilter] = useState<FilterValue>("all");

  const queryArgs = filter === "all" ? {} : { type: filter as "income" | "expense" };

  const { results, status, loadMore } = usePaginatedQuery(
    api.expenses.list,
    queryArgs,
    { initialNumItems: 20 }
  );

  const removeExpense = useMutation(api.expenses.remove);
  const restoreExpense = useMutation(api.expenses.restore);

  const handleDelete = useCallback(
    (tx: ExpenseWithCategory) => {
      removeExpense({ id: tx._id });
      show({
        message: "Transaction deleted",
        durationMs: 5000,
        action: {
          label: "Undo",
          onPress: () => {
            restoreExpense({ id: tx._id });
          },
        },
      });
    },
    [removeExpense, restoreExpense, show]
  );

  const handlePress = useCallback(
    (id: Id<"expenses">) => {
      router.push(`/(app)/expense/${id}`);
    },
    [router]
  );

  const handleLongPress = useCallback(
    (tx: ExpenseWithCategory) => {
      Alert.alert("Transaction", tx.description, [
        {
          text: "Edit",
          onPress: () => router.push(`/(app)/expense/${tx._id}`),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(tx),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [router, handleDelete]
  );

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") loadMore(20);
  }, [status, loadMore]);

  const renderItem = useCallback(
    ({ item }: { item: ExpenseWithCategory }) => (
      <ExpenseListItem
        tx={item}
        onDelete={handleDelete}
        onPress={() => handlePress(item._id)}
        onLongPress={() => handleLongPress(item)}
      />
    ),
    [handleDelete, handlePress, handleLongPress]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 12,
          gap: 12,
        }}
      >
        <Text
          style={{ fontFamily: "PlusJakartaSans_700Bold", fontSize: 24, color: "#F8FAFC" }}
        >
          Gastos
        </Text>
        <FilterBar value={filter} onChange={setFilter} />
      </View>

      {/* List */}
      {status === "LoadingFirstPage" ? (
        <View style={{ paddingHorizontal: 24, marginTop: 4 }}>
          <SkeletonList count={8} />
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          icon="💸"
          title="No transactions yet"
          subtitle={
            filter !== "all"
              ? `No ${filter} transactions found.`
              : "Start tracking your spending!"
          }
          actionLabel={filter !== "all" ? "Show all" : "Add Expense"}
          onAction={
            filter !== "all"
              ? () => setFilter("all")
              : () => router.push("/(app)/add-expense")
          }
        />
      ) : (
        <FlatList
          data={results as ExpenseWithCategory[]}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 4, gap: 8, paddingBottom: 24 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

export default function ExpensesScreen() {
  return (
    <ErrorBoundary>
      <ExpensesContent />
    </ErrorBoundary>
  );
}
