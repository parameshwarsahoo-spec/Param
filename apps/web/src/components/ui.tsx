import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-lg border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5", className)}>
      {children}
    </section>
  );
}

export function IconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="grid size-10 place-items-center rounded-lg border border-black/10 bg-white text-ink transition hover:bg-mist dark:border-white/10 dark:bg-white/10 dark:text-white"
    >
      <Icon size={18} />
    </button>
  );
}

export function StatCard({ title, value, detail, icon: Icon, tone }: { title: string; value: string; detail: string; icon: LucideIcon; tone: string }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink/60 dark:text-white/60">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <span className={cn("grid size-10 place-items-center rounded-lg text-white", tone)}>
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-4 text-sm text-ink/60 dark:text-white/60">{detail}</p>
    </Card>
  );
}
