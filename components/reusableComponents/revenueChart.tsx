"use client";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TrendingUp } from "lucide-react";

function RevenueChart({
  currentYearRevenue,
}: {
  currentYearRevenue: {
    year: number;
    totalRevenue: number;
    months: { monthLabel: string; revenue: number }[];
  };
}) {
  return (
    <Card className="border-neon-green/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-green/50 dark:hover:border-neon-green/60 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-neon-green" />
          Revenue Overview
        </CardTitle>
        <CardDescription>
          Total revenue for {currentYearRevenue.year}: ₹
          {currentYearRevenue.totalRevenue.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={currentYearRevenue.months}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--neon-green)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--neon-green)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="monthLabel"
              className="text-xs"
              tick={{ fill: "currentColor", fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor", fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--card-foreground)",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              labelStyle={{ color: "var(--card-foreground)" }}
              formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                "Revenue",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--neon-green)"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
export default RevenueChart;
