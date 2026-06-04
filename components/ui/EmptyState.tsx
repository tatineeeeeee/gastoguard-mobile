import React from "react";
import { View, Text } from "react-native";
import { Button } from "./Button";

type Props = {
  icon: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>{icon}</Text>
      <Text
        style={{
          fontFamily: "PlusJakartaSans_700Bold",
          fontSize: 18,
          color: "#F8FAFC",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#94A3B8",
            textAlign: "center",
            lineHeight: 20,
            marginBottom: 24,
          }}
        >
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} variant="primary" />
      )}
    </View>
  );
}
