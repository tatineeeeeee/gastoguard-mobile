import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { appendDigit, appendDecimal, backspace } from "@/lib/amount";

type Props = {
  value: string;
  onChange: (next: string) => void;
};

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "⌫"],
];

export function Numpad({ value, onChange }: Props) {
  const handleKey = (key: string) => {
    if (key === "⌫") {
      onChange(backspace(value));
    } else if (key === ".") {
      onChange(appendDecimal(value));
    } else {
      onChange(appendDigit(value, key));
    }
  };

  return (
    <View style={{ gap: 8 }}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row", gap: 8 }}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleKey(key)}
              activeOpacity={0.6}
              style={{
                flex: 1,
                height: 58,
                backgroundColor: "#1E293B",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#334155",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: key === "⌫" ? "Inter_400Regular" : "JetBrainsMono_500Medium",
                  fontSize: key === "⌫" ? 20 : 22,
                  color: "#F8FAFC",
                }}
              >
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}
