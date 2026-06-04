import React, { useCallback, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { FormSheet } from "@/components/ui/FormSheet";
import { DebtPaymentSheet, type DebtPaymentSheetHandle } from "@/components/debts/DebtPaymentSheet";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { View } from "react-native";
import { useToast } from "@/components/feedback/ToastProvider";
import { formatCurrency } from "@/lib/currency";

export default function PayDebtScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { show } = useToast();
  const formRef = useRef<DebtPaymentSheetHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const debt = useQuery(api.debts.getById, { id: id as Id<"debts"> });

  const handleSubmit = async () => {
    if (!formRef.current?.canSubmit) return;
    setSubmitting(true);
    await formRef.current.submit();
    setSubmitting(false);
  };

  const handlePaid = useCallback(
    (isSettled: boolean) => {
      router.back();
      if (isSettled) {
        show({ message: "Settled! 🎉 Debt fully paid.", variant: "success", durationMs: 4000 });
      } else {
        const remaining = debt
          ? debt.totalAmount - debt.paidAmount - (formRef.current ? 0 : 0)
          : 0;
        show({
          message: "Payment recorded!",
          variant: "success",
        });
      }
    },
    [router, show, debt]
  );

  if (debt === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1E293B", padding: 20 }}>
        <SkeletonCard />
      </View>
    );
  }

  if (!debt) {
    router.back();
    return null;
  }

  return (
    <FormSheet
      title={`Pay ${debt.personName}`}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
      submitLabel="Record Payment"
      submitting={submitting}
      submitDisabled={!canSubmit}
    >
      <DebtPaymentSheet
        ref={formRef}
        debt={debt}
        onPaid={handlePaid}
        onCanSubmitChange={setCanSubmit}
      />
    </FormSheet>
  );
}
