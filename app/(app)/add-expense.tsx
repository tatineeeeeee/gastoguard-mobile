import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { FormSheet } from "@/components/ui/FormSheet";
import { ExpenseForm, type ExpenseFormHandle } from "@/components/expenses/ExpenseForm";
import { useToast } from "@/components/feedback/ToastProvider";
import type { Id } from "@/convex/_generated/dataModel";

export default function AddExpenseScreen() {
  const router = useRouter();
  const { show } = useToast();
  const formRef = useRef<ExpenseFormHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = async () => {
    if (!formRef.current?.canSubmit) return;
    setSubmitting(true);
    await formRef.current.submit();
    setSubmitting(false);
  };

  const handleSubmitted = useCallback(
    (_id: Id<"expenses">) => {
      router.back();
      show({ message: "Transaction added! 🎉", variant: "success" });
    },
    [router, show]
  );

  return (
    <FormSheet
      title="Add Transaction"
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
      submitLabel="Save"
      submitting={submitting}
      submitDisabled={!canSubmit}
    >
      <ExpenseForm
        ref={formRef}
        mode="create"
        onSubmitted={handleSubmitted}
        onCanSubmitChange={setCanSubmit}
      />
    </FormSheet>
  );
}
