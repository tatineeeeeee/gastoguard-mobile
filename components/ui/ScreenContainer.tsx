import React from "react";
import { View, ScrollView, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Edge = "top" | "bottom";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  style?: ViewStyle;
};

export function ScreenContainer({
  children,
  scroll = false,
  edges = ["top"],
  contentStyle,
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes("top") ? insets.top + 16 : 0;
  const paddingBottom = edges.includes("bottom") ? Math.max(insets.bottom, 16) : 16;

  const inner: ViewStyle = {
    paddingTop,
    paddingBottom,
    paddingHorizontal: 24,
    ...contentStyle,
  };

  const container: ViewStyle = {
    flex: 1,
    backgroundColor: "#0F172A",
    ...style,
  };

  if (scroll) {
    return (
      <ScrollView style={container} contentContainerStyle={inner}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={container}>
      <View style={inner}>{children}</View>
    </View>
  );
}
