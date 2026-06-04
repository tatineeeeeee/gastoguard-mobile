import React from "react";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";

type FilterValue = "all" | "income" | "expense";

type Props = {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
};

const OPTIONS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income", activeColor: "#10B981" },
  { value: "expense", label: "Expenses", activeColor: "#F43F5E" },
];

export function FilterBar({ value, onChange }: Props) {
  return (
    <SegmentedToggle
      options={OPTIONS}
      value={value}
      onChange={(v) => onChange(v as FilterValue)}
    />
  );
}
