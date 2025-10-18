"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  FileText,
  Clipboard,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useRouter } from "next/navigation";

const mockData = {
  activeMembers: 245,
  upcomingRenewals: 23,
  pendingDues: 12450,
  lateFeesTotal: 2100,
  todayCheckins: { morning: 67, evening: 89 },
  monthlyRevenue: 85600,
  pendingAmount: 12450,
  peakHoursData: [
    { time: "6 AM", morning: 25, evening: 5 },
    { time: "7 AM", morning: 45, evening: 8 },
    { time: "8 AM", morning: 60, evening: 12 },
    { time: "9 AM", morning: 40, evening: 15 },
    { time: "10 AM", morning: 30, evening: 20 },
    { time: "6 PM", morning: 10, evening: 55 },
    { time: "7 PM", morning: 8, evening: 70 },
    { time: "8 PM", morning: 5, evening: 85 },
    { time: "9 PM", morning: 3, evening: 60 },
    { time: "10 PM", morning: 2, evening: 35 },
  ],
  revenueData: [
    { month: "Jan", revenue: 78000, pending: 8500 },
    { month: "Feb", revenue: 82000, pending: 7200 },
    { month: "Mar", revenue: 85600, pending: 12450 },
  ],
};

function Dashboard() {
  const router = useRouter();
  const [peakHoursView, setPeakHoursView] = useState<"morning" | "evening">(
    "morning"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your gym overview.
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Members</CardTitle>
            <Users className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockData.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-neon-green">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Upcoming Renewals</CardTitle>
            <Calendar className="h-4 w-4 text-neon-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockData.upcomingRenewals}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Dues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              ₹{mockData.pendingDues.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Late fees:{" "}
              <span className="text-orange-500">₹{mockData.lateFeesTotal}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              ₹{mockData.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-neon-green">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Check-ins */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-neon-blue" />
              Today's Check-ins
            </CardTitle>
            <CardDescription>Member activity breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Morning (6AM-12PM)
                    </p>
                    <p className="text-2xl">{mockData.todayCheckins.morning}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Evening (6PM-11PM)
                    </p>
                    <p className="text-2xl">{mockData.todayCheckins.evening}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Morning Progress</span>
                    <span>
                      {Math.round((mockData.todayCheckins.morning / 100) * 100)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(mockData.todayCheckins.morning / 100) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Evening Progress</span>
                    <span>
                      {Math.round((mockData.todayCheckins.evening / 100) * 100)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(mockData.todayCheckins.evening / 100) * 100}
                    className="h-2"
                  />
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Check-ins</span>
                    <Badge variant="outline">
                      {mockData.todayCheckins.morning +
                        mockData.todayCheckins.evening}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Hour</span>
                    <Badge className="bg-neon-green/10 text-neon-green">
                      8 PM (85 members)
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Capacity Utilization</span>
                    <Badge variant="outline">78%</Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Revenue vs Pending */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-neon-green" />
              Revenue Overview
            </CardTitle>
            <CardDescription>
              Monthly revenue vs pending amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockData.revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
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
                />
                <Bar dataKey="revenue" fill="var(--chart-1)" radius={4} />
                <Bar dataKey="pending" fill="var(--chart-2)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-neon-blue" />
                Peak Hours Analysis
              </CardTitle>
              <CardDescription>
                Member check-in patterns throughout the day
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={peakHoursView === "morning" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeakHoursView("morning")}
                className={
                  peakHoursView === "morning" ? "bg-neon-green text-white" : ""
                }
              >
                Morning
              </Button>
              <Button
                variant={peakHoursView === "evening" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeakHoursView("evening")}
                className={
                  peakHoursView === "evening" ? "bg-neon-blue text-white" : ""
                }
              >
                Evening
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="time"
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
              />
              <Line
                type="monotone"
                dataKey={peakHoursView}
                stroke={
                  peakHoursView === "morning"
                    ? "var(--neon-green)"
                    : "var(--neon-blue)"
                }
                strokeWidth={3}
                dot={{
                  fill:
                    peakHoursView === "morning"
                      ? "var(--neon-green)"
                      : "var(--neon-blue)",
                  strokeWidth: 2,
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-neon-green/20 to-neon-green/10 hover:from-neon-green/30 hover:to-neon-green/20 border-2 border-neon-green/40 shadow-lg shadow-neon-green/10"
              onClick={() => router.push("/members")}
            >
              <Users className="h-6 w-6 text-neon-green" />
              Add New Member
            </Button>

            <Button
              className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-purple-500/20 to-purple-500/10 hover:from-purple-500/30 hover:to-purple-500/20 border-2 border-purple-500/40 shadow-lg shadow-purple-500/10"
              onClick={() => router.push("/plans")}
            >
              <Clipboard className="h-6 w-6 text-purple-400" />
              Create Workout Plan
            </Button>
            <Button
              className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-orange-500/20 to-orange-500/10 hover:from-orange-500/30 hover:to-orange-500/20 border-2 border-orange-500/40 shadow-lg shadow-orange-500/10"
              onClick={() => router.push("/reports")}
            >
              <TrendingUp className="h-6 w-6 text-orange-400" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
