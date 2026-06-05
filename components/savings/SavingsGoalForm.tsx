import React, { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { View, Text, TextInput, Alert, Switch, TouchableOpacity, ScrollView } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { Numpad } from "@/components/ui/Numpad";
import { DateField } from "@/components/ui/DateField";
import { amountStringToCentavos } from "@/lib/amount";

export type SavingsGoalFormHandle = {
  submit: () => Promise<void>;
  canSubmit: boolean;
  submitting: boolean;
};

type Props = {
  onSubmitted: () => void;
  onCanSubmitChange?: (v: boolean) => void;
};

const ICONS = ["🏠", "🚗", "✈️", "📱", "💍", "🎓", "🎵", "📚", "🎯", "💰", "🌴", "🎉", "🍕", "🐶", "🌸", "🏋️"];

const COLORS = [
  { hex: "#10B981", label: "Green" },
  { hex: "#3B82F6", label: "Blue" },
  { hex: "#F59E0B", label: "Amber" },
  { hex: "#F43F5E", label: "Rose" },
  { hex: "#8B5CF6", label: "Purple" },
  { hex: "#EC4899", label: "Pink" },
];

export const SavingsGoalForm = forwardRef<SavingsGoalFormHandle, Props>(
  function SavingsGoalForm({ onSubmitted, onCanSubmitChange }, ref) {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("🎯");
    const [color, setColor] = useState("#10B981");
    const [amountStr, setAmountStr] = useState("");
    const [hasDeadline, setHasDeadline] = useState(false);
    const [deadline, setDeadline] = useState(Date.now() + 30 * 86400000);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const createGoal = useMutation(api.savingsGoals.create);

    const centavos = amountStringToCentavos(amountStr);
    const canSubmit = centavos > 0 && name.trim().length > 0 && !submitting;

    React.useEffect(() => {
      onCanSubmitChange?.(canSubmit);
    }, [canSubmit, onCanSubmitChange]);

    const submit = useCallback(async () => {
      if (!canSubmit) return;
      setSubmitting(true);
      try {
        await createGoal({
          name: name.trim(),
          icon,
          targetAmount: centavos,
          deadline: hasDeadline ? deadline : undefined,
          color,
          notes: notes.trim() || undefined,
        });
        onSubmitted();
      } catch (_e) {
        Alert.alert("Error", "Failed to create savings goal. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }, [canSubmit, name, icon, centavos, hasDeadline, deadline, color, notes, createGoal, onSubmitted]);

    useImperativeHandle(ref, () => ({ submit, canSubmit, submitting }), [
      submit,
      canSubmit,
      submitting,
    ]);

    return (
      <View style={{ gap: 20 }}>
        {/* Target amount */}
        <AmountDisplay value={amountStr} type="neutral" />
        <Numpad value={amountStr} onChange={setAmountStr} />

        {/* Goal name */}
        <View>
          <Text
            style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}
          >
            Goal name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Emergency Fund"
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

        {/* Icon picker */}
        <View>
          <Text
            style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}
          >
            Icon
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {ICONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => setIcon(emoji)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: icon === emoji ? "#1E293B" : "#0F172A",
                  borderWidth: 1.5,
                  borderColor: icon === emoji ? "#10B981" : "#334155",
                }}
              >
                <Text style={{ fontSize: 22 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color picker */}
        <View>
          <Text
            style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}
          >
            Color
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c.hex}
                onPress={() => setColor(c.hex)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: c.hex,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: color === c.hex ? 3 : 0,
                  borderColor: "#F8FAFC",
                }}
              >
                {color === c.hex && (
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Deadline toggle */}
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
            Set deadline
          </Text>
          <Switch
            value={hasDeadline}
            onValueChange={setHasDeadline}
            trackColor={{ false: "#334155", true: "#10B98160" }}
            thumbColor={hasDeadline ? "#10B981" : "#94A3B8"}
          />
        </View>
        {hasDeadline && (
          <DateField
            value={deadline}
            onChange={setDeadline}
            label="Target date"
            minimumDate={Date.now()}
          />
        )}

        {/* Notes */}
        <View>
          <Text
            style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8", marginBottom: 8 }}
          >
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
  }
);
