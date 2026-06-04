import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";

type MenuItem = {
  icon: string;
  label: string;
  sublabel: string;
  route?: string;
  disabled?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: "💰", label: "Budgets", sublabel: "Track spending limits", route: "/(app)/budgets" },
  { icon: "🤝", label: "Utang Tracker", sublabel: "Manage debts and loans", route: "/(app)/utang" },
  { icon: "📊", label: "Analytics", sublabel: "Coming Week 4", disabled: true },
  { icon: "🔁", label: "Recurring", sublabel: "Coming Week 2", disabled: true },
  { icon: "⚙️", label: "Settings", sublabel: "Coming Week 6", disabled: true },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => signOut() },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0F172A" }}
      contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 24 }}
    >
      <View style={{ paddingHorizontal: 24 }}>
        <Text
          style={{
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 24,
            color: "#F8FAFC",
            marginBottom: 24,
          }}
        >
          More
        </Text>

        <View style={{ gap: 12 }}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                if (!item.disabled && item.route) {
                  router.push(item.route as any);
                }
              }}
              disabled={item.disabled}
              activeOpacity={item.disabled ? 1 : 0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1E293B",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: "#334155",
                gap: 16,
                opacity: item.disabled ? 0.5 : 1,
              }}
            >
              <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 15,
                    color: "#F8FAFC",
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: "#94A3B8",
                    marginTop: 2,
                  }}
                >
                  {item.sublabel}
                </Text>
              </View>
              <Text style={{ color: item.disabled ? "#334155" : "#94A3B8", fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            marginTop: 24,
            backgroundColor: "#F43F5E20",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#F43F5E40",
          }}
        >
          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#F43F5E" }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
