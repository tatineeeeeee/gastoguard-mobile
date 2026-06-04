import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { SkeletonList } from "./Skeleton";

type Props = {
  categories: Doc<"categories">[];
  selectedId: Id<"categories"> | null;
  onSelect: (id: Id<"categories">) => void;
  loading?: boolean;
};

export function CategoryPillSelector({ categories, selectedId, onSelect, loading }: Props) {
  if (loading) {
    return (
      <View style={{ height: 56 }}>
        <SkeletonList count={1} itemHeight={44} />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {categories.map((cat) => {
        const isSelected = cat._id === selectedId;
        return (
          <TouchableOpacity
            key={cat._id}
            onPress={() => onSelect(cat._id)}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: isSelected ? cat.color : "#334155",
              backgroundColor: isSelected ? cat.color + "20" : "#1E293B",
            }}
          >
            <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: isSelected ? cat.color : "#94A3B8",
              }}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
