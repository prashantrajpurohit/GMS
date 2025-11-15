"use client";
import React from "react";

import { Button } from "@/components/ui/button";

import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Clipboard,
  User2,
  NotepadText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import RevenueChart from "@/components/reusableComponents/revenueChart";
import MemberChart from "@/components/reusableComponents/memberChart";
import { useQuery } from "@tanstack/react-query";
import { DashboardController } from "./controller";
import { useRouter } from "next/navigation";

function Dashboard() {
  const router = useRouter();
  const dashboardController = new DashboardController();
  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: dashboardController.fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Skeleton Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton Quick Actions */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Failed to load dashboard data"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.gym || !dashboardData.stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Dashboard data is not available at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { gym, stats, revenueOverview, memberRegistrationOverview } =
    dashboardData;
  const currentYearRevenue = revenueOverview?.[0];
  const currentYearRegistrations = memberRegistrationOverview?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to {gym?.name}! Here's your gym overview.
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
              {stats?.activeMembers ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled members
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
              {stats?.upcomingRenewals ?? 0}
            </div>
            {/* <p className="text-xs text-muted-foreground">Next 7 days</p> */}
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 dark:bg-gradient-to-br dark:from-orange-500/20 dark:to-slate-800/50 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Dues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-500">
              ₹{stats?.pendingDues?.amount?.toLocaleString() ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingDues?.count ?? 0}{" "}
              {stats?.pendingDues?.count === 1 ? "member" : "members"} with dues
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
              ₹{stats?.monthlyRevenue?.amount?.toLocaleString() ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.monthlyRevenue?.transactions ?? 0}{" "}
              {stats?.monthlyRevenue?.transactions === 1
                ? "transaction"
                : "transactions"}{" "}
              in {stats?.monthlyRevenue?.monthLabel ?? ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Only render if data exists */}
      {currentYearRevenue && currentYearRegistrations && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Overview Chart */}
          <RevenueChart currentYearRevenue={currentYearRevenue} />
          {/* Member Registration Overview Chart */}
          <MemberChart currentYearRegistrations={currentYearRegistrations} />
        </div>
      )}

      {/* Quick Actions */}
      <Card className="border-neon-green/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-green/50 dark:hover:border-neon-green/60 transition-all">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <Button
              className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-neon-green/20 to-neon-green/10 hover:from-neon-green/30 hover:to-neon-green/20 border-2 border-neon-green/40 shadow-lg shadow-neon-green/10 "
              onClick={() => router.push("/members")}
            >
              <Users className="h-6 w-6 text-neon-green" />
              Add New Member
            </Button>
            <Button
              onClick={() => router.push("/members")}
              className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-neon-blue/20 to-neon-blue/10 hover:from-neon-blue/30 hover:to-neon-blue/20 border-2 border-neon-blue/40 shadow-lg shadow-neon-blue/10"
            >
              <User2 className="h-6 w-6 text-neon-blue" />
              Add Staff Member
            </Button>
            <Button
              onClick={() => router.push("/plans")}
              className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-purple-500/20 to-purple-500/10 hover:from-purple-500/30 hover:to-purple-500/20 border-2 border-purple-500/40 shadow-lg shadow-purple-500/10"
            >
              <NotepadText className="h-6 w-6 text-purple-400" />
              Add Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
