import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Numpad } from "@/components/ui/Numpad";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { CategoryPillSelector } from "@/components/ui/CategoryPillSelector";
import { amountStringToCentavos } from "@/lib/amount";
import { BUDGET_PERIODS } from "@/lib/constants";

export type BudgetFormHandle = {
  submit: () => Promise<void>;
  canSubmit: boolean;
  submitting: boolean;
};

type Props = {
  onSubmitted: () => void;
  onCanSubmitChange?: (v: boolean) => void;
};

const PERIOD_OPTIONS = BUDGET_PERIODS.map((p) => ({ value: p.value, label: p.label }));

export const BudgetForm = forwardRef<BudgetFormHandle, Props>(function BudgetForm(
  { onSubmitted, onCanSubmitChange },
  ref
) {
  const [amountStr, setAmountStr] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<Id<"categories"> | null>(null);
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [submitting, setSubmitting] = useState(false);

  const categories = useQuery(api.categories.list, { type: "expense" });
  const createBudget = useMutation(api.budgets.create);

  const centavos = amountStringToCentavos(amountStr);
  const canSubmit = centavos > 0 && !submitting;

  React.useEffect(() => {
    onCanSubmitChange?.(canSubmit);
  }, [canSubmit, onCanSubmitChange]);

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await createBudget({
        categoryId: selectedCategoryId ?? undefined,
        amount: centavos,
        period,
        alertThreshold: 0.8,
      });
      onSubmitted();
    } catch (_e) {
      Alert.alert("Error", "Failed to create budget. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, selectedCategoryId, centavos, period, createBudget, onSubmitted]);

  useImperativeHandle(ref, () => ({ submit, canSubmit, submitting }), [
    submit,
    canSubmit,
    submitting,
  ]);

  return (
    <View style={{ gap: 16 }}>
      <AmountDisplay value={amountStr} type="neutral" placeholder="Budget limit" />
      <Numpad value={amountStr} onChange={setAmountStr} />

      {/* Category (optional — null = Overall) */}
      <View>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 4 }}>
          Category{" "}
          <Text style={{ color: "#334155" }}>(leave blank for overall budget)</Text>
        </Text>
        <CategoryPillSelector
          categories={categories ?? []}
          selectedId={selectedCategoryId}
          onSelect={(id) =>
            setSelectedCategoryId((prev) => (prev === id ? null : id))
          }
          loading={categories === undefined}
        />
      </View>

      {/* Period */}
      <View>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
          Period
        </Text>
        <SegmentedToggle
          options={PERIOD_OPTIONS}
          value={period}
          onChange={(v) => setPeriod(v as "weekly" | "monthly" | "yearly")}
        />
      </View>
    </View>
  );
});
