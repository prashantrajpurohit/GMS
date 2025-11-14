"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";
import { Button } from "@/components//ui/button";
import { Badge } from "@/components//ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components//ui/tabs";
import { Progress } from "@/components//ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
  DollarSignIcon,
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

// Skeleton Components
const StatCardSkeleton = () => (
  <Card className="border-border/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-4 rounded" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-28" />
    </CardContent>
  </Card>
);

const CheckinsCardSkeleton = () => (
  <Card className="border-border/50">
    <CardHeader>
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ChartCardSkeleton = ({ height = 200 }: { height?: number }) => (
  <Card className="border-border/50">
    <CardHeader>
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent>
      <Skeleton className={`h-[${height}px] w-full`} />
    </CardContent>
  </Card>
);

const PeakHoursCardSkeleton = () => (
  <Card className="border-border/50">
    <CardHeader>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[300px] w-full" />
    </CardContent>
  </Card>
);

const QuickActionsCardSkeleton = () => (
  <Card className="border-border/50">
    <CardHeader>
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

function Dashboard() {
  const router = useRouter();
  const [peakHoursView, setPeakHoursView] = useState<"morning" | "evening">(
    "morning"
  );
  const [isLoading, setIsLoading] = useState(false); // Add your actual loading state here

  // If you're fetching data, replace false with your actual loading state
  // const { data, isLoading } = useQuery({ ... });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>

        {/* Top Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Middle Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CheckinsCardSkeleton />
          <ChartCardSkeleton />
        </div>

        {/* Peak Hours Skeleton */}
        <PeakHoursCardSkeleton />

        {/* Quick Actions Skeleton */}
        <QuickActionsCardSkeleton />
      </div>
    );
  }

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
        <Card className="border-2 border-neon-green/30 bg-gradient-to-br from-neon-green/10 to-neon-green/5 dark:bg-gradient-to-br dark:from-neon-green/20 dark:to-slate-800/50 hover:border-neon-green/60 hover:shadow-lg hover:shadow-neon-green/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Members</CardTitle>
            <Users className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-neon-green">
              {mockData.activeMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-neon-green">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-neon-blue/30 bg-gradient-to-br from-neon-blue/10 to-neon-blue/5 dark:bg-gradient-to-br dark:from-neon-blue/20 dark:to-slate-800/50 hover:border-neon-blue/60 hover:shadow-lg hover:shadow-neon-blue/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Upcoming Renewals</CardTitle>
            <Calendar className="h-4 w-4 text-neon-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-neon-blue">
              {mockData.upcomingRenewals}
            </div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 dark:bg-gradient-to-br dark:from-orange-500/20 dark:to-slate-800/50 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Dues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-500">
              ₹{mockData.pendingDues.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Late fees:{" "}
              <span className="text-orange-500">₹{mockData.lateFeesTotal}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5 dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-slate-800/50 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-purple-400">
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
        <Card className="border-neon-blue/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-blue/50 dark:hover:border-neon-blue/60 transition-all">
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
        <Card className="border-neon-green/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-green/50 dark:hover:border-neon-green/60 transition-all">
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
      <Card className="border-neon-blue/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-blue/50 dark:hover:border-neon-blue/60 transition-all">
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
      <Card className="border-neon-green/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-green/50 dark:hover:border-neon-green/60 transition-all">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              onClick={() => router.push("/payments")}
            >
              <DollarSignIcon className="h-6 w-6 text-orange-400" />
              Payments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
