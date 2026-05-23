"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { categoryDistribution, monthlyTrend } from "@/lib/data";

export function SpendingPie() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={categoryDistribution} dataKey="amount" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={3}>
          {categoryDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLine() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={monthlyTrend}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="income" stroke="#4fb286" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="expense" stroke="#ee6c4d" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SavingsBars() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={monthlyTrend}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="expense" fill="#277da1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
