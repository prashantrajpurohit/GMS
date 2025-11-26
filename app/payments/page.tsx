"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  Eye,
  Send,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  MonthlyPayment,
  MonthlyPaymentDialog,
} from "@/components/payments/MonthlyPaymentDialog";

import PaymentController from "./controller";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiUrl } from "@/api/apiUrls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { endOfDay, format, startOfDay } from "date-fns";

interface Member {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  planName: string;
  planType: "Monthly" | "Quarterly" | "Yearly";
  monthlyFee: number;
  payments: MonthlyPayment[];
}

interface DateRange {
  from?: Date;
  to?: Date;
}

// Skeleton Components
const MetricCardSkeleton = () => (
  <Card className="border-muted/20 bg-card">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="h-4 w-24" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-1">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </CardContent>
  </Card>
);

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-16 rounded-full" />
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </TableCell>
  </TableRow>
);

const MobileCardSkeleton = () => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </CardContent>
  </Card>
);

function PaymentManagement() {
  const paymentController = new PaymentController();
  const queryClient = useQueryClient();

  const { mutate, isPending: statusChangeLoading } = useMutation({
    mutationFn: paymentController.updatePaymentById,
    onSuccess: () => {
      queryClient?.invalidateQueries({ queryKey: ["allPayments"] });
      toast.success("Payment updated Successfully!!");
    },
  });

  const { data: paymentsStatsData = [], isLoading: statsLoading } = useQuery({
    queryKey: ["getPaymentsStats"],
    queryFn: paymentController.getPaymentsStats,
  });

  const paymentsStats = paymentsStatsData?.stats;
  const monthlyRevenue = paymentsStats;
  console.log(paymentsStats, "paymentsStatsData");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">(
    "all"
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedMember, setSelectedMember] = useState<Record<
    string,
    any
  > | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [sendReminderDialogOpen, setSendReminderDialogOpen] = useState(false);
  const [bulkReminderDialogOpen, setBulkReminderDialogOpen] = useState(false);
  const { data = [], isLoading: paymentsLoading } = useQuery({
    queryKey: [
      "allPayments",
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
    ],
    queryFn: () => {
      const params: any = {};
      if (dateRange.from) {
        params.startDate = format(dateRange.from, "yyyy-MM-dd");
      }
      if (dateRange.to) {
        params.endDate = format(dateRange.to, "yyyy-MM-dd");
      }
      return paymentController.getAllPayments(params);
    },
  });

  const paymentsList = data?.payments || [];

  // Filter members
  const filteredMembers = useMemo(() => {
    return paymentsList?.filter((trans: Record<string, any>) => {
      const memberObj = trans?.memberId;
      const matchesSearch =
        memberObj.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memberObj.phone.includes(searchQuery);
      const matchesStatus =
        statusFilter === "all" || trans?.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [paymentsList, searchQuery, statusFilter]);

  const metrics = useMemo(() => {
    const totalMembers = filteredMembers.length;

    const paidMembers = filteredMembers.filter(
      (trans: Record<string, any>) => trans?.status?.toLowerCase() === "paid"
    ).length;

    const pendingMembers = filteredMembers.filter(
      (trans: Record<string, any>) => trans?.status?.toLowerCase() === "pending"
    ).length;

    const totalCollected = filteredMembers
      .filter(
        (trans: Record<string, any>) => trans?.status?.toLowerCase() === "paid"
      )
      .reduce((sum: number, trans: Record<string, any>) => {
        return (
          sum + (trans?.amount || trans?.memberId?.currentPlanId?.price || 0)
        );
      }, 0);

    const totalPending = filteredMembers
      .filter(
        (trans: Record<string, any>) =>
          trans?.status?.toLowerCase() === "pending"
      )
      .reduce((sum: number, trans: Record<string, any>) => {
        return (
          sum + (trans?.amount || trans?.memberId?.currentPlanId?.price || 0)
        );
      }, 0);

    return {
      totalMembers,
      paidMembers,
      pendingMembers,
      totalCollected,
      totalPending,
    };
  }, [filteredMembers]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const handleViewPayments = (member: Member) => {
    setSelectedMember(member);
    setPaymentDialogOpen(true);
  };

  const handleUpdatePayment = (month: string) => {
    mutate({
      id: month,
      payload: { status: "paid" },
    });
  };

  const handleExport = () => {
    const data = filteredMembers?.map((m: Record<string, any>) => ({
      Name: m.memberId?.name,
      Phone: m.phone,
      Email: m.email,
      Plan: `${m.planName} (${m.planType})`,
      MonthlyFee: formatCurrency(m.monthlyFee),
      Status: m?.status?.toLowerCase(),
    }));
    alert("Export feature coming soon!");
  };

  const handleSendReminder = (member: Member) => {
    setSelectedMember(member);
    setSendReminderDialogOpen(true);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      setDateRange({
        from: range.from ? startOfDay(range.from) : undefined,
        to: range.to ? endOfDay(range.to) : undefined,
      });
      return;
    }
  };

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">Monthly Payment Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage monthly member payments
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div> */}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <Card className="border-neon-blue/20 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-neon-blue" />
                  Total Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl">{paymentsStats?.totalMembers}</p>
                  <p className="text-xs text-muted-foreground">
                    Active members
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Paid This Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl">
                    {paymentsStats?.paidThisMonth?.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(paymentsStats?.paidThisMonth?.amount)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Pending This Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl">
                    {paymentsStats?.pendingThisMonth?.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(paymentsStats?.pendingThisMonth?.amount)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="border-neon-green/20 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-neon-green" />
                  Collection Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl">
                    {metrics.totalMembers > 0
                      ? Math.round(
                          (metrics.paidMembers / metrics.totalMembers) * 100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dateRange.from && dateRange.to
                      ? `${format(dateRange.from, "MMM d")} - ${format(
                          dateRange.to,
                          "MMM d"
                        )}`
                      : "All time"}
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as "all" | "paid" | "pending")
                }
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                            {format(dateRange.to, "MMM dd, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDateRange}
                    className="h-10"
                  >
                    Clear dates
                  </Button>
                )}
              </div>
            </div>

            {/* Date Range Picker */}
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Plan Fee</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredMembers?.length === 0 ? (
                <TableRow key={"6"}>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers?.map((transaction: Record<string, any>) => {
                  const currentStatus = transaction?.status;
                  const member = transaction?.memberId;
                  return (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={ApiUrl.IMAGE_BASE_URL + member.photo}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                              {member.fullName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.fullName}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {member.currentPlanId?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.currentPlanId?.duration}{" "}
                            {member.currentPlanId?.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{member.currentPlanId?.price}
                      </TableCell>
                      <TableCell className="font-medium">
                        {member?.startDate?.split("T")[0]}
                      </TableCell>
                      <TableCell className="text-center">
                        {transaction?.status?.toLowerCase() === "paid" ? (
                          <Badge className="gap-1 bg-green-500/10 text-green-500 border-green-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-red-500/10 text-red-500 border-red-500/20">
                            <XCircle className="w-3 h-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* {currentStatus === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-green-600/20 text-green-600 hover:bg-green-600/10"
                              onClick={() => handleSendReminder(member)}
                            >
                              <MessageSquare className="w-4 h-4" />
                              Remind
                            </Button>
                          )} */}
                          {transaction?.status?.toLowerCase() == "paid" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-neon-blue/20 text-neon-blue hover:bg-neon-blue/10"
                              onClick={() => handleViewPayments(member)}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setAlertDialogOpen(true);
                                setSelectedMember(transaction);
                              }}
                              disabled={statusChangeLoading}
                              className={
                                "bg-neon-green hover:bg-neon-green/90 text-black"
                              }
                            >
                              {statusChangeLoading ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Mark Paid"
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="md:hidden space-y-4">
        {paymentsLoading ? (
          <>
            <MobileCardSkeleton />
            <MobileCardSkeleton />
            <MobileCardSkeleton />
            <MobileCardSkeleton />
          </>
        ) : filteredMembers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No members found
            </CardContent>
          </Card>
        ) : (
          filteredMembers.map((transaction: Record<string, any>) => {
            const currentStatus = transaction?.status;
            const member = transaction?.memberId;

            return (
              <Card key={transaction._id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                        {member.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.phone}
                      </p>
                    </div>
                    {currentStatus === "paid" ? (
                      <Badge className="gap-1 bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="gap-1 bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                        <XCircle className="w-3 h-3" />
                        Pending
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Plan</p>
                      <p className="font-medium">{member.planName}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.planType}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Plan Fee</p>
                      <p className="font-medium"></p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {currentStatus === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2 border-green-600/20 text-green-600 hover:bg-green-600/10"
                        onClick={() => handleSendReminder(member)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Send Reminder
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className={`${
                        currentStatus === "pending" ? "flex-1" : "w-full"
                      } gap-2 border-neon-blue/20 text-neon-blue hover:bg-neon-blue/10`}
                      onClick={() => handleViewPayments(member)}
                    >
                      <Eye className="w-4 h-4" />
                      View Payments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {selectedMember && (
        <MonthlyPaymentDialog
          open={paymentDialogOpen}
          selectedTrans={selectedMember}
          onOpenChange={setPaymentDialogOpen}
          memberName={selectedMember.fullName}
          planType={selectedMember.currentPlanId?.name}
          monthlyFee={selectedMember.currentPlanId?.price}
          onUpdatePayment={handleUpdatePayment}
        />
      )}

      {/* Alert Dialog */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure, want to mark as paid ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will mark as paid to the
              selected payment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-neon-green hover:bg-neon-green/90 text-black"
              disabled={statusChangeLoading}
              onClick={() =>
                mutate({
                  id: selectedMember?._id as string,
                  payload: { status: "paid" },
                })
              }
            >
              {statusChangeLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PaymentManagement;
