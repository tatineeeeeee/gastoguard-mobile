import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { View, Text, TextInput, Alert, Switch } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Numpad } from "@/components/ui/Numpad";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { DateField } from "@/components/ui/DateField";
import { amountStringToCentavos } from "@/lib/amount";

export type DebtFormHandle = {
  submit: () => Promise<void>;
  canSubmit: boolean;
  submitting: boolean;
};

type Props = {
  defaultType: "owed_to_me" | "i_owe";
  onSubmitted: () => void;
  onCanSubmitChange?: (v: boolean) => void;
};

const TYPE_OPTIONS = [
  { value: "owed_to_me", label: "Utang sa Akin", activeColor: "#10B981" },
  { value: "i_owe", label: "Utang Ko", activeColor: "#F43F5E" },
];

export const DebtForm = forwardRef<DebtFormHandle, Props>(function DebtForm(
  { defaultType, onSubmitted, onCanSubmitChange },
  ref
) {
  const [debtType, setDebtType] = useState<"owed_to_me" | "i_owe">(defaultType);
  const [personName, setPersonName] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState(Date.now() + 7 * 86400000);
  const [submitting, setSubmitting] = useState(false);

  const createDebt = useMutation(api.debts.create);

  const centavos = amountStringToCentavos(amountStr);
  const canSubmit = centavos > 0 && personName.trim().length > 0 && !submitting;

  React.useEffect(() => {
    onCanSubmitChange?.(canSubmit);
  }, [canSubmit, onCanSubmitChange]);

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await createDebt({
        personName: personName.trim(),
        type: debtType,
        totalAmount: centavos,
        description: description.trim() || undefined,
        dueDate: hasDueDate ? dueDate : undefined,
        notes: notes.trim() || undefined,
      });
      onSubmitted();
    } catch (_e) {
      Alert.alert("Error", "Failed to create debt record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit,
    personName,
    debtType,
    centavos,
    description,
    hasDueDate,
    dueDate,
    notes,
    createDebt,
    onSubmitted,
  ]);

  useImperativeHandle(ref, () => ({ submit, canSubmit, submitting }), [
    submit,
    canSubmit,
    submitting,
  ]);

  return (
    <View style={{ gap: 16 }}>
      {/* Type toggle */}
      <SegmentedToggle
        options={TYPE_OPTIONS}
        value={debtType}
        onChange={(v) => setDebtType(v as "owed_to_me" | "i_owe")}
      />

      {/* Amount */}
      <AmountDisplay value={amountStr} type={debtType === "i_owe" ? "expense" : "income"} />
      <Numpad value={amountStr} onChange={setAmountStr} />

      {/* Person name */}
      <View>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
          Person's name
        </Text>
        <TextInput
          value={personName}
          onChangeText={setPersonName}
          placeholder="e.g. Juan dela Cruz"
          placeholderTextColor="#334155"
          maxLength={100}
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

      {/* Description */}
      <View>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
          Description <Text style={{ color: "#334155" }}>(optional)</Text>
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Lunch, Grab fare"
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

      {/* Due date toggle */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0F172A",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#334155",
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 15, color: "#F8FAFC" }}>
          Set due date
        </Text>
        <Switch
          value={hasDueDate}
          onValueChange={setHasDueDate}
          trackColor={{ false: "#334155", true: "#10B98160" }}
          thumbColor={hasDueDate ? "#10B981" : "#94A3B8"}
        />
      </View>
      {hasDueDate && (
        <DateField
          value={dueDate}
          onChange={setDueDate}
          label="Due date"
          minimumDate={Date.now()}
        />
      )}

      {/* Notes */}
      <View>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
          Notes <Text style={{ color: "#334155" }}>(optional)</Text>
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Any additional notes…"
          placeholderTextColor="#334155"
          maxLength={500}
          multiline
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
            minHeight: 80,
            textAlignVertical: "top",
          }}
        />
      </View>
    </View>
  );
});
