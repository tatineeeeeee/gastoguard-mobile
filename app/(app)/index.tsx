import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentUser } from "../../hooks/use-current-user";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useCurrentUser();

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0F172A" }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}
    >
      <View style={{ paddingHorizontal: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          {isLoading ? (
            <View style={{ height: 32, width: 200, backgroundColor: "#1E293B", borderRadius: 8 }} />
          ) : (
            <Text
              style={{ fontFamily: "PlusJakartaSans_700Bold", fontSize: 24, color: "#F8FAFC" }}
            >
              {getGreeting()}{firstName ? `, ${firstName}` : ""}
            </Text>
          )}
          <Text
            style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#94A3B8", marginTop: 4 }}
          >
            Here's your financial overview.
          </Text>
        </View>

        {/* Convex connection status */}
        <View
          style={{
            backgroundColor: "#1E293B",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#334155",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 11,
              color: "#94A3B8",
              letterSpacing: 0.8,
              marginBottom: 12,
            }}
          >
            CONNECTION STATUS
          </Text>
          {isLoading ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <ActivityIndicator color="#10B981" size="small" />
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#94A3B8" }}>
                Connecting to Convex...
              </Text>
            </View>
          ) : user ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#10B981" }} />
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#10B981" }}>
                Connected — {user.email}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#F59E0B" }} />
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#F59E0B" }}>
                Setting up your account...
              </Text>
            </View>
          )}
        </View>

        {/* KPI cards */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
          {["Income", "Expenses", "Balance"].map((label) => (
            <View
              key={label}
              style={{
                flex: 1,
                backgroundColor: "#1E293B",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: "#334155",
              }}
            >
              <Text
                style={{ fontFamily: "Inter_500Medium", fontSize: 10, color: "#94A3B8", marginBottom: 4 }}
              >
                {label}
              </Text>
              <Text
                style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 16, color: "#94A3B8" }}
              >
                ₱ —
              </Text>
            </View>
          ))}
        </View>

        {/* Week 2 placeholder */}
        <View
          style={{
            backgroundColor: "#1E293B",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#334155",
            borderStyle: "dashed",
            alignItems: "center",
            paddingVertical: 48,
          }}
        >
          <Text style={{ fontSize: 32, marginBottom: 8 }}>📊</Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#94A3B8",
              textAlign: "center",
            }}
          >
            {"Charts and transactions\ncoming in Week 2"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
