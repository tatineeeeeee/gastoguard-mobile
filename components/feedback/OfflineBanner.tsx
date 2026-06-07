import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetworkStatus } from "@/hooks/use-network-status";

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOffline) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(-60, { duration: 250 });
      opacity.value = withTiming(0, { duration: 250 });
    }
  }, [isOffline, translateY, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.banner,
        { paddingTop: insets.top + 8 },
        animStyle,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>⚡ You're offline — changes will sync when reconnected</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F59E0B",
    paddingBottom: 10,
    paddingHorizontal: 16,
    zIndex: 999,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#0F172A",
    textAlign: "center",
  },
});
