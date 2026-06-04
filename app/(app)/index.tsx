import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { KpiCards } from "@/components/expenses/KpiCards";
import { RecentTransactionsList } from "@/components/expenses/RecentTransactionsList";
import { monthRange } from "@/lib/dates";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const { startMs, endMs } = monthRange(Date.now());

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useCurrentUser();
  const summary = useQuery(api.expenses.getSummary, { startDate: startMs, endDate: endMs });

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0F172A" }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingHorizontal: 24, gap: 20 }}>
        {/* Header */}
        <View>
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

        {/* KPI cards */}
        <KpiCards summary={summary} loading={summary === undefined} />

        {/* Recent transactions */}
        <RecentTransactionsList limit={5} />
      </View>
    </ScrollView>
  );
}
