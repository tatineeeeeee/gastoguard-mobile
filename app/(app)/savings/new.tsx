import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { FormSheet } from "@/components/ui/FormSheet";
import { SavingsGoalForm, type SavingsGoalFormHandle } from "@/components/savings/SavingsGoalForm";
import { useToast } from "@/components/feedback/ToastProvider";

export default function NewSavingsGoalScreen() {
  const router = useRouter();
  const { show } = useToast();
  const formRef = useRef<SavingsGoalFormHandle>(null);
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
    show({ message: "Savings goal created!", variant: "success" });
  }, [router, show]);

  return (
    <FormSheet
      title="New Savings Goal"
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
      submitLabel="Create Goal"
      submitting={submitting}
      submitDisabled={!canSubmit}
    >
      <SavingsGoalForm
        ref={formRef}
        onSubmitted={handleSubmitted}
        onCanSubmitChange={setCanSubmit}
      />
    </FormSheet>
  );
}
