import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Numpad } from "@/components/ui/Numpad";
import { MoneyText } from "@/components/ui/MoneyText";
import { Button } from "@/components/ui/Button";
import { amountStringToCentavos } from "@/lib/amount";
import { centavosToPesos } from "@/lib/currency";

export type ContributionSheetHandle = {
  submit: () => Promise<void>;
  canSubmit: boolean;
  submitting: boolean;
};

type Props = {
  goal: Doc<"savingsGoals">;
  mode: "add" | "withdraw";
  onDone: (isCompleted: boolean) => void;
  onCanSubmitChange?: (v: boolean) => void;
};

export const ContributionSheet = forwardRef<ContributionSheetHandle, Props>(
  function ContributionSheet({ goal, mode, onDone, onCanSubmitChange }, ref) {
    const [amountStr, setAmountStr] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const addContribution = useMutation(api.savingsGoals.addContribution);
    const withdrawContribution = useMutation(api.savingsGoals.withdrawContribution);

    const centavos = amountStringToCentavos(amountStr);
    const remaining = goal.targetAmount - goal.savedAmount;
    const canSubmit = centavos > 0 && !submitting;

    React.useEffect(() => {
      onCanSubmitChange?.(canSubmit);
    }, [canSubmit, onCanSubmitChange]);

    const fillFull = useCallback(() => {
      if (mode === "add") {
        setAmountStr(centavosToPesos(Math.max(0, remaining)).toString());
      } else {
        setAmountStr(centavosToPesos(goal.savedAmount).toString());
      }
    }, [mode, remaining, goal.savedAmount]);

    const submit = useCallback(async () => {
      if (!canSubmit) return;
      setSubmitting(true);
      try {
        if (mode === "add") {
          const result = await addContribution({
            goalId: goal._id as Id<"savingsGoals">,
            amount: centavos,
            notes: notes.trim() || undefined,
          });
          onDone(result.isCompleted);
        } else {
          await withdrawContribution({
            goalId: goal._id as Id<"savingsGoals">,
            amount: centavos,
            notes: notes.trim() || undefined,
          });
          onDone(false);
        }
      } catch (_e) {
        Alert.alert("Error", "Failed to record. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }, [canSubmit, mode, goal._id, centavos, notes, addContribution, withdrawContribution, onDone]);

    useImperativeHandle(ref, () => ({ submit, canSubmit, submitting }), [
      submit,
      canSubmit,
      submitting,
    ]);

    const accentColor = mode === "add" ? "#10B981" : "#F59E0B";

    return (
      <View style={{ gap: 16 }}>
        {/* Balance row */}
        <View
          style={{
            backgroundColor: "#0F172A",
            borderRadius: 12,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#94A3B8" }}>
            {mode === "add" ? "Remaining to goal" : "Currently saved"}
          </Text>
          <MoneyText
            centavos={mode === "add" ? remaining : goal.savedAmount}
            type="income"
            size="md"
          />
        </View>

        <AmountDisplay value={amountStr} type={mode === "add" ? "income" : "expense"} />

        <Button
          label={mode === "add" ? "Fill remaining amount" : "Withdraw all"}
          onPress={fillFull}
          variant="surface"
          fullWidth
          fontSize={14}
        />

        <Numpad value={amountStr} onChange={setAmountStr} />

        <View>
          <Text
            style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}
          >
            Notes <Text style={{ color: "#334155" }}>(optional)</Text>
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Monthly savings"
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
      </View>
    );
  }
);
