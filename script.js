const key = "sahonomics-finpilot-theme";
const saved = localStorage.getItem(key);
if (saved === "dark") document.body.classList.add("dark");

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(key, document.body.classList.contains("dark") ? "dark" : "light");
});

const expenseStorageKey = "sahonomics-finpilot-expenses";
const monthlyIncome = 8200;
const baseMonthlyExpense = 5360;
const seedExpenses = [
  { merchant: "Green Bowl Cafe", category: "Food", amount: 36.5, method: "Card", date: "Today" },
  { merchant: "Metro Pass", category: "Travel", amount: 48, method: "Wallet", date: "Yesterday" },
  { merchant: "Cloud Storage", category: "Bills", amount: 12.99, method: "Card", date: "May 20" },
  { merchant: "Online Market", category: "Shopping", amount: 128.4, method: "UPI", date: "May 18" }
];

const modal = document.getElementById("expenseModal");
const form = document.getElementById("expenseForm");
const error = document.getElementById("expenseError");
const dateInput = document.getElementById("expenseDate");
const amountInput = document.getElementById("expenseAmount");
const merchantInput = document.getElementById("expenseMerchant");

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function savedExpenses() {
  try {
    return JSON.parse(localStorage.getItem(expenseStorageKey) || "[]");
  } catch {
    return [];
  }
}

function allExpenses() {
  return [...savedExpenses(), ...seedExpenses];
}

function renderExpenses() {
  const rows = document.getElementById("expenseRows");
  rows.innerHTML = "";
  allExpenses().slice(0, 8).forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(expense.merchant)}</td>
      <td>${escapeHtml(expense.category)}</td>
      <td>${escapeHtml(expense.method)}</td>
      <td>${escapeHtml(expense.date)}</td>
      <td>${money(Number(expense.amount))}</td>
    `;
    rows.appendChild(row);
  });

  const addedTotal = savedExpenses().reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalExpense = baseMonthlyExpense + addedTotal;
  const remaining = monthlyIncome - totalExpense;
  const savingsRate = Math.max(Math.round((remaining / monthlyIncome) * 100), 0);
  document.getElementById("totalExpense").textContent = money(totalExpense);
  document.getElementById("remainingBalance").textContent = money(remaining);
  document.getElementById("savingsRate").textContent = `${savingsRate}%`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function openModal() {
  error.textContent = "";
  form.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  setTimeout(() => amountInput.focus(), 0);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function displayDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

document.getElementById("openExpenseModal").addEventListener("click", openModal);
document.getElementById("mobileAddExpense").addEventListener("click", openModal);
document.getElementById("closeExpenseModal").addEventListener("click", closeModal);
document.getElementById("cancelExpense").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const amount = Number(data.get("amount"));
  const merchant = String(data.get("merchant") || "").trim();
  if (!Number.isFinite(amount) || amount <= 0) {
    error.textContent = "Enter a valid expense amount.";
    amountInput.focus();
    return;
  }
  if (!merchant) {
    error.textContent = "Enter a merchant or vendor name.";
    merchantInput.focus();
    return;
  }

  const nextExpense = {
    merchant,
    amount,
    category: String(data.get("category")),
    method: String(data.get("method")),
    date: displayDate(String(data.get("date"))),
    notes: String(data.get("notes") || "").trim()
  };
  const next = [nextExpense, ...savedExpenses()];
  localStorage.setItem(expenseStorageKey, JSON.stringify(next));
  renderExpenses();
  closeModal();
  document.getElementById("expenses").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderExpenses();
