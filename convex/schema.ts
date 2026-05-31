import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    currency: v.optional(v.string()), // default: "PHP"
  }).index("by_clerkId", ["clerkId"]),

  categories: defineTable({
    userId: v.id("users"),
    name: v.string(),
    icon: v.string(), // emoji or icon name
    color: v.string(), // hex color
    type: v.union(v.literal("expense"), v.literal("income")),
    isDefault: v.boolean(),
    parentId: v.optional(v.id("categories")), // subcategory support
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"]),

  expenses: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    amount: v.number(), // stored in centavos (integer)
    description: v.string(),
    date: v.number(), // Unix timestamp ms
    type: v.union(v.literal("expense"), v.literal("income")),
    notes: v.optional(v.string()),
    receiptId: v.optional(v.id("_storage")),
    recurringConfigId: v.optional(v.id("recurringTransactions")),
    tags: v.optional(v.array(v.string())),
    isArchived: v.optional(v.boolean()), // soft-delete support
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"])
    .index("by_user_and_category", ["userId", "categoryId"])
    .index("by_user_type_date", ["userId", "type", "date"])
    .index("by_recurring", ["recurringConfigId"]),

  budgets: defineTable({
    userId: v.id("users"),
    categoryId: v.optional(v.id("categories")), // null = overall budget
    amount: v.number(), // limit in centavos
    period: v.union(
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    ),
    startDate: v.number(),
    isActive: v.boolean(),
    alertThreshold: v.optional(v.number()), // 0.8 = alert at 80%
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "categoryId"]),

  debts: defineTable({
    userId: v.id("users"),
    personName: v.string(),            // who owes / who you owe
    type: v.union(v.literal("owed_to_me"), v.literal("i_owe")), // utang sa akin vs utang ko
    totalAmount: v.number(),           // centavos
    paidAmount: v.number(),            // centavos — sum of payments so far
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),   // Unix ms
    createdAt: v.number(),             // Unix ms
    isSettled: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_settled", ["userId", "isSettled"]),

  debtPayments: defineTable({
    userId: v.id("users"),
    debtId: v.id("debts"),
    amount: v.number(),                // centavos
    date: v.number(),                  // Unix ms
    notes: v.optional(v.string()),
  })
    .index("by_debt", ["debtId"]),

  savingsGoals: defineTable({
    userId: v.id("users"),
    name: v.string(),                  // "Concert tickets", "New laptop"
    icon: v.string(),                  // emoji
    targetAmount: v.number(),          // centavos
    savedAmount: v.number(),           // centavos — sum of contributions
    deadline: v.optional(v.number()),  // Unix ms
    createdAt: v.number(),             // Unix ms
    isCompleted: v.boolean(),
    color: v.string(),                 // hex for progress bar
    notes: v.optional(v.string()),
    sortOrder: v.optional(v.number()), // drag-to-reorder position
  })
    .index("by_user", ["userId"])
    .index("by_user_and_completed", ["userId", "isCompleted"]),

  savingsContributions: defineTable({
    userId: v.id("users"),
    goalId: v.id("savingsGoals"),
    amount: v.number(),                // centavos
    date: v.number(),                  // Unix ms
    notes: v.optional(v.string()),
  })
    .index("by_goal", ["goalId"]),

  savingsChallenges: defineTable({
    userId: v.id("users"),
    type: v.string(),               // challenge type key
    name: v.string(),
    description: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    targetAmount: v.optional(v.number()),  // centavos — for spending limit challenges
    isCompleted: v.boolean(),
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_active", ["userId", "isActive"]),

  achievements: defineTable({
    userId: v.id("users"),
    key: v.string(),              // unique achievement identifier
    unlockedAt: v.number(),       // Unix ms when unlocked
  })
    .index("by_user", ["userId"])
    .index("by_user_and_key", ["userId", "key"]),

  recurringTransactions: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    amount: v.number(),
    description: v.string(),
    type: v.union(v.literal("expense"), v.literal("income")),
    frequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("biweekly"),
      v.literal("monthly"),
      v.literal("yearly")
    ),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    nextDueDate: v.number(),
    isActive: v.boolean(),
    lastProcessedDate: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_next_due", ["isActive", "nextDueDate"]),
});
