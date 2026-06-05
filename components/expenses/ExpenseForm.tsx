import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Numpad } from "@/components/ui/Numpad";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { CategoryPillSelector } from "@/components/ui/CategoryPillSelector";
import { DateField } from "@/components/ui/DateField";
import { amountStringToCentavos } from "@/lib/amount";
import { centavosToPesos } from "@/lib/currency";
import type { ExpenseWithCategory } from "@/lib/types";
import { useHaptics } from "@/hooks/use-haptics";
import { ReceiptPicker } from "@/components/expenses/ReceiptPicker";

export type ExpenseFormHandle = {
  submit: () => Promise<void>;
  canSubmit: boolean;
  submitting: boolean;
};

const TYPE_OPTIONS = [
  { value: "expense", label: "Expense", activeColor: "#F43F5E" },
  { value: "income", label: "Income", activeColor: "#10B981" },
];

type Props = {
  mode: "create" | "edit";
  initial?: ExpenseWithCategory;
  onSubmitted: (id: Id<"expenses">) => void;
  onCanSubmitChange?: (canSubmit: boolean) => void;
};

export const ExpenseForm = forwardRef<ExpenseFormHandle, Props>(
  function ExpenseForm({ mode, initial, onSubmitted, onCanSubmitChange }, ref) {
    const [txType, setTxType] = useState<"expense" | "income">(
      initial?.type ?? "expense"
    );
    const [amountStr, setAmountStr] = useState<string>(
      initial ? centavosToPesos(initial.amount).toString() : ""
    );
    const [selectedCategoryId, setSelectedCategoryId] = useState<Id<"categories"> | null>(
      initial?.categoryId ?? null
    );
    const [description, setDescription] = useState(initial?.description ?? "");
    const [date, setDate] = useState(initial?.date ?? Date.now());
    const [receiptStorageId, setReceiptStorageId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const haptics = useHaptics();
    const categories = useQuery(api.categories.list, { type: txType });
    const createExpense = useMutation(api.expenses.create);
    const updateExpense = useMutation(api.expenses.update);

    const centavos = amountStringToCentavos(amountStr);
    const canSubmit =
      centavos > 0 && selectedCategoryId !== null && description.trim().length > 0 && !submitting;

    React.useEffect(() => {
      onCanSubmitChange?.(canSubmit);
    }, [canSubmit, onCanSubmitChange]);

    const handleTypeChange = useCallback((v: string) => {
      setTxType(v as "expense" | "income");
      setSelectedCategoryId(null);
    }, []);

    const submit = useCallback(async () => {
      if (!canSubmit || !selectedCategoryId) return;
      setSubmitting(true);
      try {
        if (mode === "create") {
          const id = await createExpense({
            categoryId: selectedCategoryId,
            amount: centavos,
            description: description.trim(),
            date,
            type: txType,
            receiptId: receiptStorageId as any ?? undefined,
          });
          haptics.success();
          onSubmitted(id);
        } else if (initial) {
          await updateExpense({
            id: initial._id,
            categoryId: selectedCategoryId,
            amount: centavos,
            description: description.trim(),
            date,
            type: txType,
          });
          onSubmitted(initial._id);
        }
      } catch (_e) {
        Alert.alert("Error", "Failed to save transaction. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }, [
      canSubmit,
      selectedCategoryId,
      mode,
      initial,
      createExpense,
      updateExpense,
      centavos,
      description,
      date,
      txType,
      onSubmitted,
    ]);

    useImperativeHandle(ref, () => ({ submit, canSubmit, submitting }), [
      submit,
      canSubmit,
      submitting,
    ]);

    return (
      <View style={{ gap: 16 }}>
        {/* Amount display */}
        <AmountDisplay value={amountStr} type={txType} />

        {/* Type toggle */}
        <SegmentedToggle options={TYPE_OPTIONS} value={txType} onChange={handleTypeChange} />

        {/* Numpad */}
        <Numpad value={amountStr} onChange={setAmountStr} />

        {/* Category */}
        <View>
          <Text
            style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}
          >
            Category
          </Text>
          <CategoryPillSelector
            categories={categories ?? []}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            loading={categories === undefined}
          />
        </View>

        {/* Description */}
        <View>
          <Text
            style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}
          >
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Lunch at Jollibee"
            placeholderTextColor="#334155"
            maxLength={200}
            style={{
              backgroundColor: "#0F172A",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#334155",
              paddingVertical: 12,
              paddingHorizontal: 16,
              fontFamily: "Inter_400Regular",
              fontSize: 15,
              color: "#F8FAFC",
            }}
          />
        </View>

        {/* Date */}
        <DateField value={date} onChange={setDate} label="Date" />

        {/* Receipt — create mode only */}
        {mode === "create" && (
          <ReceiptPicker
            storageId={receiptStorageId}
            onUpload={setReceiptStorageId}
            onRemove={() => setReceiptStorageId(null)}
          />
        )}
      </View>
    );
  }
);
