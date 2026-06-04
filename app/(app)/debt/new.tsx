import React, { useCallback, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FormSheet } from "@/components/ui/FormSheet";
import { DebtForm, type DebtFormHandle } from "@/components/debts/DebtForm";
import { useToast } from "@/components/feedback/ToastProvider";

export default function NewDebtScreen() {
  const router = useRouter();
  const { show } = useToast();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const defaultType = (type === "i_owe" ? "i_owe" : "owed_to_me") as "owed_to_me" | "i_owe";

  const formRef = useRef<DebtFormHandle>(null);
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
    show({ message: "Debt recorded!", variant: "success" });
  }, [router, show]);

  return (
    <FormSheet
      title="Add Utang"
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
      submitLabel="Save"
      submitting={submitting}
      submitDisabled={!canSubmit}
    >
      <DebtForm
        ref={formRef}
        defaultType={defaultType}
        onSubmitted={handleSubmitted}
        onCanSubmitChange={setCanSubmit}
      />
    </FormSheet>
  );
}
