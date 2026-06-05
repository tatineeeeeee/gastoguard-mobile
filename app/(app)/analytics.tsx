import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MonthRecapCards } from "@/components/analytics/MonthRecapCards";
import { CategoryBars } from "@/components/analytics/CategoryBars";
import { HealthScoreGauge } from "@/components/analytics/HealthScoreGauge";
import { InsightsSection } from "@/components/analytics/InsightsSection";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: 16,
        color: "#F8FAFC",
        marginBottom: 2,
      }}
    >
      {title}
    </Text>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#1E293B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#334155",
        padding: 16,
      }}
    >
      {children}
    </View>
  );
}

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();

  const now = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();

    const thisMonthStart = new Date(year, month, 1).getTime();
    const thisMonthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
    const prevMonthStart = new Date(year, month - 1, 1).getTime();
    const prevMonthEnd = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    return { thisMonthStart, thisMonthEnd, prevMonthStart, prevMonthEnd };
  }, []);

  const recap = useQuery(api.analytics.getMonthlySummaryRecap, {
    monthStart: now.thisMonthStart,
    monthEnd: now.thisMonthEnd,
    prevMonthStart: now.prevMonthStart,
    prevMonthEnd: now.prevMonthEnd,
  });

  const categoryComparison = useQuery(api.analytics.getCategoryComparison, {
    thisMonthStart: now.thisMonthStart,
    thisMonthEnd: now.thisMonthEnd,
    lastMonthStart: now.prevMonthStart,
    lastMonthEnd: now.prevMonthEnd,
  });

  const healthScore = useQuery(api.analytics.getFinancialHealthScore, {
    monthStart: now.thisMonthStart,
    monthEnd: now.thisMonthEnd,
  });

  const insights = useQuery(api.analytics.getInsights, {
    startDate: now.thisMonthStart,
    endDate: now.thisMonthEnd,
    prevStartDate: now.prevMonthStart,
    prevEndDate: now.prevMonthEnd,
  });

  const streak = useQuery(api.analytics.getLoggingStreak, {});

  const isLoading =
    recap === undefined ||
    categoryComparison === undefined ||
    healthScore === undefined ||
    insights === undefined ||
    streak === undefined;

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 16,
        }}
      >
        <Text
          style={{
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 24,
            color: "#F8FAFC",
          }}
        >
          Analytics
        </Text>
        <Text
          style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#94A3B8", marginTop: 2 }}
        >
          {new Date().toLocaleString("en-PH", { month: "long", year: "numeric" })}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Recap */}
        <View style={{ gap: 8 }}>
          <SectionHeader title="Month Summary" />
          {isLoading || !recap ? (
            <>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <SkeletonCard style={{ flex: 1 }} />
                <SkeletonCard style={{ flex: 1 }} />
                <SkeletonCard style={{ flex: 1 }} />
              </View>
              <SkeletonCard />
            </>
          ) : (
            <MonthRecapCards recap={recap} />
          )}
        </View>

        {/* Category Comparison */}
        <View style={{ gap: 8 }}>
          <SectionHeader title="Spending by Category" />
          <SectionCard>
            {isLoading || !categoryComparison ? (
              <View style={{ gap: 12 }}>
                {[1, 2, 3, 4].map((i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <Skeleton width={24} height={24} rounded />
                    <View style={{ flex: 1, gap: 4 }}>
                      <Skeleton width="70%" height={8} />
                      <Skeleton width="50%" height={6} />
                    </View>
                  </View>
                ))}
              </View>
            ) : categoryComparison.length === 0 ? (
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#94A3B8",
                  textAlign: "center",
                  paddingVertical: 16,
                }}
              >
                No expense data for this month yet.
              </Text>
            ) : (
              <CategoryBars categories={categoryComparison} />
            )}
          </SectionCard>
        </View>

        {/* Health Score */}
        <View style={{ gap: 8 }}>
          <SectionHeader title="Financial Health" />
          <SectionCard>
            {isLoading || !healthScore ? (
              <View style={{ alignItems: "center", gap: 16 }}>
                <Skeleton width={140} height={140} rounded />
                <View style={{ width: "100%", gap: 10 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} width="100%" height={10} />
                  ))}
                </View>
              </View>
            ) : (
              <HealthScoreGauge
                score={healthScore.score}
                breakdown={healthScore.breakdown}
              />
            )}
          </SectionCard>
        </View>

        {/* Insights */}
        <View style={{ gap: 8 }}>
          <SectionHeader title="Insights" />
          {isLoading || !insights || !streak ? (
            <View style={{ gap: 8 }}>
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : (
            <InsightsSection
              insights={insights}
              streak={streak.streak}
              longestStreak={streak.longestStreak}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
