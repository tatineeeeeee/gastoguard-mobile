import type { Doc, Id } from "@/convex/_generated/dataModel";

export type ExpenseWithCategory = Doc<"expenses"> & {
  category: Doc<"categories"> | null;
};

export type BudgetWithSpending = Doc<"budgets"> & {
  category: Doc<"categories"> | null;
  spent: number;
  percentage: number;
  periodStart: number;
  periodEnd: number;
};

export type ExpenseSummary = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  count: number;
};

export type DebtSummary = {
  totalOwedToMe: number;
  totalIOwe: number;
  countOwedToMe: number;
  countIOwe: number;
  net: number;
};
