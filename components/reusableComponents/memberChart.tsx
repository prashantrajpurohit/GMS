"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { UserPlus } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MemberChart({
  currentYearRegistrations,
}: {
  currentYearRegistrations: {
    year: number;
    totalRegistrations: number;
    months: { monthLabel: string; registrations: number }[];
  };
}) {
  return (
    <Card className="border-neon-blue/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-blue/50 dark:hover:border-neon-blue/60 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-neon-blue" />
          Member Registrations
        </CardTitle>
        <CardDescription>
          Total registrations for {currentYearRegistrations.year}:{" "}
          {currentYearRegistrations.totalRegistrations}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentYearRegistrations.months}>
            <defs>
              <linearGradient
                id="registrationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--neon-blue)"
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--neon-blue)"
                  stopOpacity={0.6}
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
              allowDecimals={false}
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
              formatter={(value: number) => [value, "Registrations"]}
            />
            <Bar
              dataKey="registrations"
              fill="url(#registrationGradient)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
export default MemberChart;
