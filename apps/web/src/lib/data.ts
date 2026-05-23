export const summary = {
  totalIncome: 8200,
  totalExpense: 5360,
  remainingBalance: 2840,
  savingsPercentage: 35
};

export const categoryDistribution = [
  { name: "Food", amount: 980, color: "#ee6c4d" },
  { name: "Travel", amount: 620, color: "#277da1" },
  { name: "Rent", amount: 2100, color: "#4fb286" },
  { name: "Shopping", amount: 720, color: "#f4b942" },
  { name: "Bills", amount: 540, color: "#8b5cf6" },
  { name: "Health", amount: 400, color: "#14b8a6" }
];

export const monthlyTrend = [
  { month: "Jan", income: 7600, expense: 5100 },
  { month: "Feb", income: 7700, expense: 4980 },
  { month: "Mar", income: 7900, expense: 5520 },
  { month: "Apr", income: 8000, expense: 5200 },
  { month: "May", income: 8200, expense: 5360 }
];

export const budgets = [
  { name: "Food", spent: 980, limit: 1200 },
  { name: "Travel", spent: 620, limit: 800 },
  { name: "Shopping", spent: 720, limit: 650 },
  { name: "Bills", spent: 540, limit: 700 }
];

export const expenses = [
  { merchant: "Green Bowl Cafe", category: "Food", amount: 36.5, method: "Card", date: "Today" },
  { merchant: "Metro Pass", category: "Travel", amount: 48, method: "Wallet", date: "Yesterday" },
  { merchant: "Cloud Storage", category: "Bills", amount: 12.99, method: "Card", date: "May 20" },
  { merchant: "Online Market", category: "Shopping", amount: 128.4, method: "UPI", date: "May 18" }
];

export const insights = [
  "You spent 25% more on dining this month. Try setting a weekday lunch cap.",
  "Shopping crossed its category budget by $70. Move non-urgent purchases to next month.",
  "Three recurring subscriptions total $42.99. Review services unused in the last 30 days.",
  "Projected next month spend is $5,628 based on current recurring payments."
];
