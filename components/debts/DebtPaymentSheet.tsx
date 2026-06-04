import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Numpad } from "@/components/ui/Numpad";
import { Button } from "@/components/ui/Button";
import { MoneyText } from "@/components/ui/MoneyText";
import { amountStringToCentavos } from "@/lib/amount";
import { centavosToPesos } from "@/lib/currency";

export type DebtPaymentSheetHandle = {
  submit: () => Promise<void>;
  canSubmit: boolean;
  submitting: boolean;
};

type Props = {
  debt: Doc<"debts">;
  onPaid: (isSettled: boolean) => void;
  onCanSubmitChange?: (v: boolean) => void;
};

export const DebtPaymentSheet = forwardRef<DebtPaymentSheetHandle, Props>(
  function DebtPaymentSheet({ debt, onPaid, onCanSubmitChange }, ref) {
    const [amountStr, setAmountStr] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const addPayment = useMutation(api.debts.addPayment);

    const remaining = debt.totalAmount - debt.paidAmount;
    const centavos = amountStringToCentavos(amountStr);
    const canSubmit = centavos > 0 && centavos <= remaining && !submitting;

    React.useEffect(() => {
      onCanSubmitChange?.(canSubmit);
    }, [canSubmit, onCanSubmitChange]);

    const fillFull = useCallback(() => {
      setAmountStr(centavosToPesos(remaining).toString());
    }, [remaining]);

    const submit = useCallback(async () => {
      if (!canSubmit) return;
      setSubmitting(true);
      try {
        const result = await addPayment({
          debtId: debt._id,
          amount: centavos,
          notes: notes.trim() || undefined,
        });
        onPaid(result.isSettled);
      } catch (_e) {
        Alert.alert("Error", "Failed to record payment. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }, [canSubmit, debt._id, centavos, notes, addPayment, onPaid]);

    useImperativeHandle(ref, () => ({ submit, canSubmit, submitting }), [
      submit,
      canSubmit,
      submitting,
    ]);

    return (
      <View style={{ gap: 16 }}>
        {/* Remaining */}
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
            Remaining
          </Text>
          <MoneyText centavos={remaining} type="expense" size="md" />
        </View>

        <AmountDisplay value={amountStr} type="income" />

        <Button
          label="Pay full amount"
          onPress={fillFull}
          variant="surface"
          fullWidth
          fontSize={14}
        />

        <Numpad value={amountStr} onChange={setAmountStr} />

        {centavos > remaining && (
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#F43F5E", textAlign: "center" }}>
            Amount exceeds remaining balance
          </Text>
        )}

        <View>
          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}>
            Notes <Text style={{ color: "#334155" }}>(optional)</Text>
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. GCash, Cash"
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
