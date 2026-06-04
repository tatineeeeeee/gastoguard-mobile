import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title: string;
  onCancel: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  submitting?: boolean;
  submitDisabled?: boolean;
  children: React.ReactNode;
};

export function FormSheet({
  title,
  onCancel,
  onSubmit,
  submitLabel = "Save",
  submitting = false,
  submitDisabled = false,
  children,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#1E293B" }}
    >
      {/* Drag handle */}
      <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#334155" }} />
      </View>

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#334155",
        }}
      >
        <TouchableOpacity onPress={onCancel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: "#94A3B8" }}>
            Cancel
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 18,
            color: "#F8FAFC",
          }}
        >
          {title}
        </Text>

        {onSubmit ? (
          <TouchableOpacity
            onPress={onSubmit}
            disabled={submitDisabled || submitting}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 15,
                color: submitDisabled || submitting ? "#334155" : "#10B981",
              }}
            >
              {submitting ? "Saving…" : submitLabel}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 48 }} />
        )}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: Math.max(insets.bottom, 20) + 20,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
