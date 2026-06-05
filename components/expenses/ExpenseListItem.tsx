import React, { memo, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type Animated from "react-native-reanimated";
import { useAnimatedStyle } from "react-native-reanimated";
import { TransactionRow } from "./TransactionRow";
import type { ExpenseWithCategory } from "@/lib/types";
import { useHaptics } from "@/hooks/use-haptics";

type Props = {
  tx: ExpenseWithCategory;
  onDelete: (tx: ExpenseWithCategory) => void;
  onPress: () => void;
  onLongPress?: () => void;
};

function DeleteAction({ dragX }: { dragX: Animated.SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: Math.max(dragX.value + 80, 0) }],
  }));

  return (
    <View
      style={{
        width: 80,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F43F5E15",
      }}
    >
      <Text style={{ fontSize: 22 }}>🗑️</Text>
    </View>
  );
}

export const ExpenseListItem = memo(function ExpenseListItem({
  tx,
  onDelete,
  onPress,
  onLongPress,
}: Props) {
  const swipeRef = useRef<any>(null);
  const haptics = useHaptics();

  const renderRightActions = useCallback(
    (_progress: Animated.SharedValue<number>, dragX: Animated.SharedValue<number>) => (
      <DeleteAction dragX={dragX} />
    ),
    []
  );

  const handleSwipeOpen = useCallback(() => {
    haptics.heavy();
    onDelete(tx);
    swipeRef.current?.close();
  }, [tx, onDelete, haptics]);

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleSwipeOpen}
      rightThreshold={60}
      friction={2}
      overshootRight={false}
    >
      <TransactionRow tx={tx} onPress={onPress} onLongPress={onLongPress} />
    </Swipeable>
  );
});
