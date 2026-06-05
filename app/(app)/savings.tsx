import React from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { SavingsGoalCard } from "@/components/savings/SavingsGoalCard";
import { SavingsSummaryHeader } from "@/components/savings/SavingsSummaryHeader";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/feedback/ToastProvider";

export default function SavingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { show } = useToast();

  const goals = useQuery(api.savingsGoals.list, { showCompleted: false });
  const summary = useQuery(api.savingsGoals.getSummary, {});
  const removeGoal = useMutation(api.savingsGoals.remove);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Goal", "Are you sure you want to delete this savings goal and all its contributions?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removeGoal({ id: id as Id<"savingsGoals"> });
            show({ message: "Goal deleted.", variant: "success" });
          } catch {
            show({ message: "Failed to delete goal.", variant: "error" });
          }
        },
      },
    ]);
  };

  const handleContribute = (goal: Doc<"savingsGoals">) => {
    router.push(`/(app)/savings/${goal._id}/contribute?mode=add` as any);
  };

  const handleWithdraw = (goal: Doc<"savingsGoals">) => {
    router.push(`/(app)/savings/${goal._id}/contribute?mode=withdraw` as any);
  };

  const isLoading = goals === undefined || summary === undefined;

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 24,
            color: "#F8FAFC",
          }}
        >
          Savings
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/savings/new" as any)}
          style={{
            backgroundColor: "#10B981",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" }}
          >
            + Goal
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ paddingHorizontal: 24, gap: 12 }}>
          {summary && (
            <SavingsSummaryHeader
              activeCount={summary.activeCount}
              completedCount={summary.completedCount}
              totalSaved={summary.totalSaved}
              totalTarget={summary.totalTarget}
              overallProgress={summary.overallProgress}
            />
          )}
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : goals.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <EmptyState
            icon="🎯"
            title="No savings goals yet"
            subtitle="Set a goal to start tracking your progress towards something you care about."
            actionLabel="Add Goal"
            onAction={() => router.push("/(app)/savings/new" as any)}
          />
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            paddingHorizontal: 24,
            gap: 12,
            paddingBottom: 100,
          }}
          ListHeaderComponent={
            summary ? (
              <SavingsSummaryHeader
                activeCount={summary.activeCount}
                completedCount={summary.completedCount}
                totalSaved={summary.totalSaved}
                totalTarget={summary.totalTarget}
                overallProgress={summary.overallProgress}
              />
            ) : null
          }
          renderItem={({ item }) => (
            <SavingsGoalCard
              goal={item}
              onContribute={handleContribute}
              onWithdraw={handleWithdraw}
              onDelete={handleDelete}
            />
          )}
        />
      )}
    </View>
  );
}
