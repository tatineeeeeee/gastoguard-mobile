import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { FormSheet } from "@/components/ui/FormSheet";
import { BudgetForm, type BudgetFormHandle } from "@/components/budgets/BudgetForm";
import { useToast } from "@/components/feedback/ToastProvider";

export default function NewBudgetScreen() {
  const router = useRouter();
  const { show } = useToast();
  const formRef = useRef<BudgetFormHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = async () => {
    if (!formRef.current?.canSubmit) return;
    setSubmitting(true);
    await formRef.current.submit();
    setSubmitting(false);
  };

  const handleSubmitted = useCallback(() => {
    router.back();
    show({ message: "Budget created!", variant: "success" });
  }, [router, show]);

  return (
    <FormSheet
      title="New Budget"
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
      submitLabel="Create"
      submitting={submitting}
      submitDisabled={!canSubmit}
    >
      <BudgetForm
        ref={formRef}
        onSubmitted={handleSubmitted}
        onCanSubmitChange={setCanSubmit}
      />
    </FormSheet>
  );
}
