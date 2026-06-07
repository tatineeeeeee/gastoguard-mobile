import { Tabs, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { OfflineBanner } from "@/components/feedback/OfflineBanner";
import { useHaptics } from "@/hooks/use-haptics";

const TAB_CONFIG = [
  { name: "index", label: "Home", icon: "🏠" },
  { name: "expenses", label: "Gastos", icon: "💸" },
  { name: "add-expense", label: "", icon: "+" },
  { name: "savings", label: "Savings", icon: "🎯" },
  { name: "more", label: "More", icon: "⋯" },
];

function GastoGuardTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#1E293B",
        borderTopWidth: 1,
        borderTopColor: "#334155",
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const isFAB = route.name === "add-expense";
        const isFocused = state.index === index;
        const config = TAB_CONFIG.find((t) => t.name === route.name);

        if (!config) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isFAB) {
          return (
            <View
              key={route.key}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <TouchableOpacity
                onPress={() => { haptics.medium(); onPress(); }}
                style={{
                  width: 56,
                  height: 56,
                  marginTop: -24,
                  borderRadius: 28,
                  backgroundColor: "#10B981",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#10B981",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                }}
                accessibilityLabel="Add transaction"
                accessibilityRole="button"
              >
                <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", lineHeight: 32 }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4 }}
            accessibilityRole="button"
            accessibilityLabel={config?.label}
          >
            <Text style={{ fontSize: 20 }}>{config?.icon}</Text>
            {config?.label ? (
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 10,
                  marginTop: 2,
                  color: isFocused ? "#10B981" : "#94A3B8",
                }}
              >
                {config.label}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AppLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <ToastProvider>
      <OfflineBanner />
      <Tabs
        tabBar={(props) => <GastoGuardTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="expenses" />
        <Tabs.Screen name="add-expense" options={{ presentation: "modal" }} />
        <Tabs.Screen name="savings" />
        <Tabs.Screen name="more" />
        {/* Modal routes — hidden from tab bar */}
        <Tabs.Screen name="expense/[id]" options={{ href: null }} />
        <Tabs.Screen name="budget/new" options={{ href: null, presentation: "modal" }} />
        <Tabs.Screen name="debt/new" options={{ href: null, presentation: "modal" }} />
        <Tabs.Screen name="debt/[id]/pay" options={{ href: null, presentation: "modal" }} />
        {/* Savings modal routes */}
        <Tabs.Screen name="savings/new" options={{ href: null, presentation: "modal" }} />
        <Tabs.Screen name="savings/[id]/contribute" options={{ href: null, presentation: "modal" }} />
        {/* Analytics screen */}
        <Tabs.Screen name="analytics" options={{ href: null }} />
        {/* Push screens from More */}
        <Tabs.Screen name="budgets" options={{ href: null }} />
        <Tabs.Screen name="utang" options={{ href: null }} />
      </Tabs>
    </ToastProvider>
  );
}
