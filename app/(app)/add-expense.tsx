import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddExpenseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#1E293B", paddingBottom: insets.bottom }}>
      {/* Modal handle */}
      <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 16 }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#334155" }} />
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Text style={{ fontFamily: "PlusJakartaSans_700Bold", fontSize: 20, color: "#F8FAFC" }}>
            Add Transaction
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#94A3B8" }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 48 }}>
          <Text style={{ fontSize: 40, marginBottom: 16 }}>➕</Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#94A3B8", textAlign: "center" }}>
            {"Full expense form\ncoming in Week 2"}
          </Text>
        </View>
      </View>
    </View>
  );
}
