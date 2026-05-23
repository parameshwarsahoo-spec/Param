import { Bell, Download, FileText, Fingerprint, LineChart, Moon, Plus, ReceiptText, ShieldCheck, Sparkles, Target, WalletCards } from "lucide-react";
import { budgets, expenses, insights, summary } from "@/lib/data";
import { money } from "@/lib/utils";
import { Card, IconButton, StatCard } from "@/components/ui";
import { SavingsBars, SpendingPie, TrendLine } from "@/components/charts";

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 rounded-lg border border-black/5 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-white/5 lg:block">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-mint text-white">
              <WalletCards size={22} />
            </div>
            <div>
              <p className="font-semibold">Param Personal Finance</p>
              <p className="text-xs text-ink/55 dark:text-white/55">Personal finance</p>
            </div>
          </div>
          <nav className="mt-8 space-y-1 text-sm">
            {["Dashboard", "Expenses", "Budgets", "Analytics", "Reports", "Settings"].map((item, index) => (
              <a key={item} className={`block rounded-lg px-3 py-2 ${index === 0 ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-ink/70 hover:bg-mist dark:text-white/70 dark:hover:bg-white/10"}`} href="#">
                {item}
              </a>
            ))}
          </nav>
          <div className="mt-8 rounded-lg bg-mist p-4 text-sm dark:bg-white/10">
            <ShieldCheck className="mb-3 text-mint" size={22} />
            <p className="font-medium">Security ready</p>
            <p className="mt-1 text-ink/60 dark:text-white/60">JWT sessions, biometric mobile unlock, encrypted storage hooks, and GDPR controls.</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-3 py-2">
            <div>
              <p className="text-sm text-ink/60 dark:text-white/60">May 2026 overview</p>
              <h1 className="text-3xl font-semibold tracking-normal">Money dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <IconButton icon={Moon} label="Toggle theme" />
              <IconButton icon={Bell} label="Notifications" />
              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-coral px-4 text-sm font-medium text-white shadow-soft transition hover:brightness-95">
                <Plus size={18} /> Add expense
              </button>
            </div>
          </header>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total income" value={money(summary.totalIncome)} detail="Salary and recurring income" icon={WalletCards} tone="bg-mint" />
            <StatCard title="Total expense" value={money(summary.totalExpense)} detail="Across 8 categories" icon={ReceiptText} tone="bg-coral" />
            <StatCard title="Balance" value={money(summary.remainingBalance)} detail="Available after bills" icon={Target} tone="bg-ocean" />
            <StatCard title="Savings rate" value={`${summary.savingsPercentage}%`} detail="7% above last month" icon={LineChart} tone="bg-amber" />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Monthly trend</h2>
                <button className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10">
                  <Download size={16} /> Export
                </button>
              </div>
              <TrendLine />
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">Category split</h2>
              <SpendingPie />
            </Card>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent expenses</h2>
                <button className="text-sm font-medium text-ocean">View all</button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-ink/55 dark:text-white/55">
                    <tr>
                      <th className="py-2 font-medium">Merchant</th>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium">Method</th>
                      <th className="py-2 font-medium">Date</th>
                      <th className="py-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.merchant} className="border-t border-black/5 dark:border-white/10">
                        <td className="py-3 font-medium">{expense.merchant}</td>
                        <td className="py-3">{expense.category}</td>
                        <td className="py-3">{expense.method}</td>
                        <td className="py-3">{expense.date}</td>
                        <td className="py-3 text-right">{money(expense.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">Budget planner</h2>
              <div className="mt-4 space-y-4">
                {budgets.map((budget) => {
                  const pct = Math.min(Math.round((budget.spent / budget.limit) * 100), 130);
                  return (
                    <div key={budget.name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{budget.name}</span>
                        <span className={pct > 100 ? "text-coral" : "text-ink/60 dark:text-white/60"}>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/10 dark:bg-white/10">
                        <div className={`h-2 rounded-full ${pct > 100 ? "bg-coral" : "bg-mint"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <h2 className="flex items-center gap-2 text-lg font-semibold"><Sparkles size={19} /> Smart insights</h2>
              <div className="mt-4 space-y-3">
                {insights.map((insight) => (
                  <p key={insight} className="rounded-lg bg-mist p-3 text-sm text-ink/75 dark:bg-white/10 dark:text-white/75">{insight}</p>
                ))}
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Reports</h2>
                <FileText size={20} className="text-ocean" />
              </div>
              <SavingsBars />
              <div className="grid gap-2 sm:grid-cols-3">
                {["Monthly PDF", "CSV export", "Tax report"].map((label) => (
                  <button key={label} className="rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-mist dark:border-white/10 dark:hover:bg-white/10">
                    {label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-black/10 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-[#111816] lg:hidden">
        {["Home", "Add", "Reports", "Secure"].map((item, index) => (
          <button key={item} className="grid place-items-center gap-1 text-ink/70 dark:text-white/70">
            {index === 1 ? <Plus size={18} /> : index === 2 ? <FileText size={18} /> : index === 3 ? <Fingerprint size={18} /> : <WalletCards size={18} />}
            {item}
          </button>
        ))}
      </nav>
    </main>
  );
}
