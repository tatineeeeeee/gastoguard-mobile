import React, { useCallback, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { View, Alert } from "react-native";
import { FormSheet } from "@/components/ui/FormSheet";
import { ContributionSheet, type ContributionSheetHandle } from "@/components/savings/ContributionSheet";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useToast } from "@/components/feedback/ToastProvider";

export default function ContributeScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const router = useRouter();
  const { show } = useToast();
  const formRef = useRef<ContributionSheetHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const goal = useQuery(api.savingsGoals.getById, { id: id as Id<"savingsGoals"> });
  const contributionMode = mode === "withdraw" ? "withdraw" : "add";

  const handleSubmit = async () => {
    if (!formRef.current?.canSubmit) return;
    setSubmitting(true);
    await formRef.current.submit();
    setSubmitting(false);
  };

  const handleDone = useCallback(
    (isCompleted: boolean) => {
      router.back();
      if (isCompleted) {
        show({
          message: "Goal reached! Congratulations!",
          variant: "success",
          durationMs: 4000,
        });
      } else if (contributionMode === "add") {
        show({ message: "Contribution recorded!", variant: "success" });
      } else {
        show({ message: "Withdrawal recorded.", variant: "success" });
      }
    },
    [router, show, contributionMode]
  );

  if (goal === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1E293B", padding: 20 }}>
        <SkeletonCard />
      </View>
    );
  }

  if (!goal) {
    router.back();
    return null;
  }

  const title =
    contributionMode === "add"
      ? `Add to ${goal.name}`
      : `Withdraw from ${goal.name}`;

  const submitLabel = contributionMode === "add" ? "Add Savings" : "Withdraw";

  return (
    <FormSheet
      title={title}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      submitting={submitting}
      submitDisabled={!canSubmit}
    >
      <ContributionSheet
        ref={formRef}
        goal={goal}
        mode={contributionMode}
        onDone={handleDone}
        onCanSubmitChange={setCanSubmit}
      />
    </FormSheet>
  );
}
