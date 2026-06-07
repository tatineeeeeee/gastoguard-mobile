import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { DebtSummaryHeader } from "@/components/debts/DebtSummaryHeader";
import { DebtCard } from "@/components/debts/DebtCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { useToast } from "@/components/feedback/ToastProvider";
import type { DebtSummary } from "@/lib/types";

const TAB_OPTIONS = [
  { value: "owed_to_me", label: "Utang sa Akin", activeColor: "#10B981" },
  { value: "i_owe", label: "Utang Ko", activeColor: "#F43F5E" },
];

function UtangContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { show } = useToast();
  const [tab, setTab] = useState<"owed_to_me" | "i_owe">("owed_to_me");

  const debts = useQuery(api.debts.list, { showSettled: false });
  const summary = useQuery(api.debts.getSummary, {});
  const settleDebt = useMutation(api.debts.settle);

  const filtered = debts?.filter((d) => d.type === tab) ?? [];

  const handlePay = useCallback(
    (debt: Doc<"debts">) => {
      router.push(`/(app)/debt/${debt._id}/pay`);
    },
    [router]
  );

  const handleSettle = useCallback(
    (id: string) => {
      Alert.alert("Settle Debt", "Mark this debt as fully settled?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Settle",
          onPress: async () => {
            await settleDebt({ id: id as any });
            show({ message: "Settled! 🎉", variant: "success" });
          },
        },
      ]);
    },
    [settleDebt, show]
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 22, color: "#94A3B8" }}>←</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: "PlusJakartaSans_700Bold", fontSize: 24, color: "#F8FAFC" }}>
              Utang
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/(app)/debt/new", params: { type: tab } })}
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

        {/* Summary */}
        <DebtSummaryHeader summary={summary as DebtSummary | undefined} />

        {/* Tab switcher */}
        <SegmentedToggle options={TAB_OPTIONS} value={tab} onChange={(v) => setTab(v as "owed_to_me" | "i_owe")} />
      </View>

      {/* List */}
      {debts === undefined ? (
        <View style={{ paddingHorizontal: 24 }}>
          <SkeletonList count={3} itemHeight={150} />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={tab === "owed_to_me" ? "🤝" : "💸"}
          title={tab === "owed_to_me" ? "No one owes you" : "You're debt-free!"}
          subtitle={
            tab === "owed_to_me"
              ? "Track money others owe you."
              : "Record money you owe to someone."
          }
          actionLabel="Add Record"
          onAction={() =>
            router.push({ pathname: "/(app)/debt/new", params: { type: tab } })
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <DebtCard debt={item} onPay={handlePay} onSettle={handleSettle} />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 4, gap: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

export default function UtangScreen() {
  return (
    <ErrorBoundary>
      <UtangContent />
    </ErrorBoundary>
  );
}
