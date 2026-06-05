import React, { useCallback, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FormSheet } from "@/components/ui/FormSheet";
import { ExpenseForm, type ExpenseFormHandle } from "@/components/expenses/ExpenseForm";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useToast } from "@/components/feedback/ToastProvider";
import type { ExpenseWithCategory } from "@/lib/types";

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const formRef = useRef<ExpenseFormHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const [receiptVisible, setReceiptVisible] = useState(false);

  const expense = useQuery(api.expenses.getById, { id: id as Id<"expenses"> });
  const removeExpense = useMutation(api.expenses.remove);
  const restoreExpense = useMutation(api.expenses.restore);

  const receiptUrl = useQuery(
    api.expenses.getReceiptUrl,
    expense?.receiptId ? { storageId: expense.receiptId } : "skip"
  );

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removeExpense({ id: id as Id<"expenses"> });
          router.back();
          show({
            message: "Transaction deleted",
            durationMs: 5000,
            action: {
              label: "Undo",
              onPress: () => restoreExpense({ id: id as Id<"expenses"> }),
            },
          });
        },
      },
    ]);
  }, [id, removeExpense, restoreExpense, router, show]);

  const handleSubmit = async () => {
    if (!formRef.current?.canSubmit) return;
    setSubmitting(true);
    await formRef.current.submit();
    setSubmitting(false);
  };

  const handleSubmitted = useCallback(
    (_id: Id<"expenses">) => {
      router.back();
      show({ message: "Transaction updated!", variant: "success" });
    },
    [router, show]
  );

  if (expense === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1E293B", padding: 20, paddingTop: insets.top + 20 }}>
        <SkeletonCard />
      </View>
    );
  }

  if (expense === null) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1E293B", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: "Inter_400Regular", color: "#94A3B8", fontSize: 14 }}>
          Transaction not found.
        </Text>
      </View>
    );
  }

  return (
    <FormSheet
      title="Edit Transaction"
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
      submitLabel="Update"
      submitting={submitting}
      submitDisabled={!canSubmit}
    >
      <TouchableOpacity
        onPress={handleDelete}
        style={{
          backgroundColor: "#F43F5E15",
          borderRadius: 12,
          padding: 14,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#F43F5E40",
        }}
      >
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#F43F5E" }}>
          🗑️  Delete Transaction
        </Text>
      </TouchableOpacity>

      {/* Receipt thumbnail */}
      {receiptUrl && (
        <>
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8" }}>
              Receipt
            </Text>
            <TouchableOpacity onPress={() => setReceiptVisible(true)} activeOpacity={0.8}>
              <Image
                source={{ uri: receiptUrl }}
                style={{ width: 120, height: 90, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 11,
                  color: "#94A3B8",
                  marginTop: 4,
                }}
              >
                Tap to view full size
              </Text>
            </TouchableOpacity>
          </View>

          <Modal visible={receiptVisible} transparent animationType="fade">
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#0F172Aee",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={1}
              onPress={() => setReceiptVisible(false)}
            >
              <Image
                source={{ uri: receiptUrl }}
                style={{ width: "90%", height: "70%", borderRadius: 12 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: "#94A3B8",
                  marginTop: 16,
                }}
              >
                Tap anywhere to close
              </Text>
            </TouchableOpacity>
          </Modal>
        </>
      )}

      <ExpenseForm
        ref={formRef}
        mode="edit"
        initial={expense as ExpenseWithCategory}
        onSubmitted={handleSubmitted}
        onCanSubmitChange={setCanSubmit}
      />
    </FormSheet>
  );
}
