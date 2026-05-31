import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SavingsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A", paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        <Text style={{ fontFamily: "PlusJakartaSans_700Bold", fontSize: 24, color: "#F8FAFC", marginBottom: 4 }}>
          Savings
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#94A3B8" }}>
          Savings goals — coming Week 4
        </Text>
      </View>
    </View>
  );
}
