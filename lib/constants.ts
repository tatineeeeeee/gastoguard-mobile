export const DEFAULT_CATEGORIES = [
  { name: "Food", icon: "🍔", color: "#F59E0B" },
  { name: "Transport", icon: "🚗", color: "#3B82F6" },
  { name: "Shopping", icon: "🛒", color: "#8B5CF6" },
  { name: "Entertainment", icon: "🎮", color: "#F43F5E" },
  { name: "Education", icon: "📚", color: "#06B6D4" },
  { name: "Health", icon: "💊", color: "#10B981" },
  { name: "Housing", icon: "🏠", color: "#EC4899" },
  { name: "Bills", icon: "📄", color: "#6366F1" },
  { name: "Other", icon: "📦", color: "#94A3B8" },
  { name: "Salary", icon: "💰", color: "#10B981" },
  { name: "Allowance", icon: "🤑", color: "#22C55E" },
  { name: "Freelance", icon: "💻", color: "#3B82F6" },
  { name: "Other Income", icon: "🎁", color: "#94A3B8" },
] as const;

export const CHART_COLORS = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#F43F5E",
  "#06B6D4",
] as const;

export const BUDGET_PERIODS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;
