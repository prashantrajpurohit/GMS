"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Calendar,
  Eye,
  Send,
  MessageSquare,
} from "lucide-react";
import {
  MonthlyPayment,
  MonthlyPaymentDialog,
} from "@/components/payments/MonthlyPaymentDialog";
import { MonthlySendReminderDialog } from "@/components/payments/MonthlySendReminderDialog";
import { MonthlyBulkReminderDialog } from "@/components/payments/MonthlyBulkReminderDialog";
import PaymentController from "./controller";
import { useQuery } from "@tanstack/react-query";

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  planName: string;
  planType: "Monthly" | "Quarterly" | "Yearly";
  monthlyFee: number;
  payments: MonthlyPayment[];
}

// Generate last 12 months
const generateMonths = () => {
  const months = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthName = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    months.push(monthName);
  }

  return months;
};

const allMonths = generateMonths();

// Mock member data with monthly payment history
const mockMembers: Member[] = [
  {
    id: "M001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@example.com",
    planName: "Premium Plan",
    planType: "Monthly",
    monthlyFee: 2500,
    payments: allMonths.map((month, index) => ({
      month,
      status: index < 10 ? "paid" : "pending",
      paymentDate:
        index < 10 ? new Date(2025, 9 - index, 15).toISOString() : undefined,
      amount: 2500,
    })),
  },
  {
    id: "M002",
    name: "Priya Sharma",
    phone: "+91 98765 43211",
    email: "priya@example.com",
    planName: "Basic Plan",
    planType: "Monthly",
    monthlyFee: 1500,
    payments: allMonths.map((month, index) => ({
      month,
      status: index < 12 ? "paid" : "pending",
      paymentDate:
        index < 12 ? new Date(2025, 9 - index, 20).toISOString() : undefined,
      amount: 1500,
    })),
  },
  {
    id: "M003",
    name: "Amit Singh",
    phone: "+91 98765 43212",
    email: "amit@example.com",
    planName: "Premium Plan",
    planType: "Monthly",
    monthlyFee: 2500,
    payments: allMonths.map((month, index) => ({
      month,
      status: index < 8 ? "paid" : "pending",
      paymentDate:
        index < 8 ? new Date(2025, 9 - index, 10).toISOString() : undefined,
      amount: 2500,
    })),
  },
  {
    id: "M004",
    name: "Sneha Patel",
    phone: "+91 98765 43213",
    email: "sneha@example.com",
    planName: "Premium Plan",
    planType: "Quarterly",
    monthlyFee: 2300,
    payments: allMonths.map((month, index) => ({
      month,
      status: index < 9 ? "paid" : "pending",
      paymentDate:
        index < 9 ? new Date(2025, 9 - index, 5).toISOString() : undefined,
      amount: 2300,
    })),
  },
  {
    id: "M005",
    name: "Rahul Verma",
    phone: "+91 98765 43214",
    email: "rahul@example.com",
    planName: "Basic Plan",
    planType: "Monthly",
    monthlyFee: 1500,
    payments: allMonths.map((month, index) => ({
      month,
      status: index < 11 ? "paid" : "pending",
      paymentDate:
        index < 11 ? new Date(2025, 9 - index, 22).toISOString() : undefined,
      amount: 1500,
    })),
  },
  {
    id: "M006",
    name: "Ananya Reddy",
    phone: "+91 98765 43215",
    email: "ananya@example.com",
    planName: "Premium Plan",
    planType: "Monthly",
    monthlyFee: 2500,
    payments: allMonths.map((month, index) => ({
      month,
      status: index < 7 ? "paid" : "pending",
      paymentDate:
        index < 7 ? new Date(2025, 9 - index, 8).toISOString() : undefined,
      amount: 2500,
    })),
  },
  {
    id: "M007",
    name: "Vikram Choudhary",
    phone: "+91 98765 43216",
    email: "vikram@example.com",
    planName: "Elite Plan",
    planType: "Yearly",
    monthlyFee: 2000,
    payments: allMonths.map((month, index) => ({
      month,
      status: index < 12 ? "paid" : "pending",
      paymentDate:
        index < 12 ? new Date(2025, 9 - index, 1).toISOString() : undefined,
      amount: 2000,
    })),
  },
  {
    id: "M008",
    name: "Meera Iyer",
    phone: "+91 98765 43217",
    email: "meera@example.com",
    planName: "Basic Plan",
    planType: "Monthly",
    monthlyFee: 1500,
    payments: allMonths.map((month, index) => ({
      month,
      status: index < 6 ? "paid" : "pending",
      paymentDate:
        index < 6 ? new Date(2025, 9 - index, 12).toISOString() : undefined,
      amount: 1500,
    })),
  },
];

function PaymentManagement() {
  const paymentController = new PaymentController();
  const { data } = useQuery({
    queryKey: ["allPayments"],
    queryFn: paymentController.getAllPayments,
  });
  console.log(data, "data");

  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">(
    "all"
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    allMonths[allMonths.length - 1]
  ); // Current month
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [sendReminderDialogOpen, setSendReminderDialogOpen] = useState(false);
  const [bulkReminderDialogOpen, setBulkReminderDialogOpen] = useState(false);

  // Get current month status for each member
  const getMemberCurrentStatus = (member: Member): "paid" | "pending" => {
    const currentMonthPayment = member.payments.find(
      (p) => p.month === selectedMonth
    );
    return currentMonthPayment?.status || "pending";
  };

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.includes(searchQuery) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());

      const currentStatus = getMemberCurrentStatus(member);
      const matchesStatus =
        statusFilter === "all" || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter, selectedMonth]);

  // Calculate metrics for selected month
  const metrics = useMemo(() => {
    const totalMembers = members.length;

    const paidMembers = members.filter(
      (m) => getMemberCurrentStatus(m) === "paid"
    ).length;

    const pendingMembers = members.filter(
      (m) => getMemberCurrentStatus(m) === "pending"
    ).length;

    const totalCollected = members
      .filter((m) => getMemberCurrentStatus(m) === "paid")
      .reduce((sum, m) => {
        const payment = m.payments.find((p) => p.month === selectedMonth);
        return sum + (payment?.amount || 0);
      }, 0);

    const totalPending = members
      .filter((m) => getMemberCurrentStatus(m) === "pending")
      .reduce((sum, m) => {
        const payment = m.payments.find((p) => p.month === selectedMonth);
        return sum + (payment?.amount || 0);
      }, 0);

    return {
      totalMembers,
      paidMembers,
      pendingMembers,
      totalCollected,
      totalPending,
    };
  }, [members, selectedMonth]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const handleViewPayments = (member: Member) => {
    setSelectedMember(member);
    setPaymentDialogOpen(true);
  };

  const handleUpdatePayment = (month: string, status: "paid" | "pending") => {
    if (!selectedMember) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id
          ? {
              ...m,
              payments: m.payments.map((p) =>
                p.month === month
                  ? {
                      ...p,
                      status,
                      paymentDate:
                        status === "paid"
                          ? new Date().toISOString()
                          : undefined,
                    }
                  : p
              ),
            }
          : m
      )
    );

    // Update selected member to reflect changes
    setSelectedMember((prev) =>
      prev
        ? {
            ...prev,
            payments: prev.payments.map((p) =>
              p.month === month
                ? {
                    ...p,
                    status,
                    paymentDate:
                      status === "paid" ? new Date().toISOString() : undefined,
                  }
                : p
            ),
          }
        : null
    );
  };

  const handleExport = () => {
    // Mock export functionality
    const data = filteredMembers.map((m) => ({
      Name: m.name,
      Phone: m.phone,
      Email: m.email,
      Plan: `${m.planName} (${m.planType})`,
      MonthlyFee: formatCurrency(m.monthlyFee),
      Status: getMemberCurrentStatus(m),
    }));

    console.log("Exporting data:", data);
    alert("Export feature coming soon!");
  };

  const handleSendReminder = (member: Member) => {
    setSelectedMember(member);
    setSendReminderDialogOpen(true);
  };

  const handleBulkReminders = () => {
    setBulkReminderDialogOpen(true);
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleBulkReminders}
            disabled={metrics.pendingMembers === 0}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Reminders</span>
            <span className="sm:hidden">Bulk</span>
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neon-blue/20 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-neon-blue" />
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl">{metrics.totalMembers}</p>
              <p className="text-xs text-muted-foreground">Active members</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Paid This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl">{metrics.paidMembers}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(metrics.totalCollected)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Pending This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl">{metrics.pendingMembers}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(metrics.totalPending)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neon-green/20 bg-card">
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
                For {selectedMonth}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
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

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {allMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <TableHead>Monthly Fee</TableHead>
                <TableHead>Status ({selectedMonth})</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => {
                  const currentStatus = getMemberCurrentStatus(member);
                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{member.planName}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.planType}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(member.monthlyFee)}
                      </TableCell>
                      <TableCell>
                        {currentStatus === "paid" ? (
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
                          {currentStatus === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-green-600/20 text-green-600 hover:bg-green-600/10"
                              onClick={() => handleSendReminder(member)}
                            >
                              <MessageSquare className="w-4 h-4" />
                              Remind
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 border-neon-blue/20 text-neon-blue hover:bg-neon-blue/10"
                            onClick={() => handleViewPayments(member)}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredMembers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No members found
            </CardContent>
          </Card>
        ) : (
          filteredMembers.map((member) => {
            const currentStatus = getMemberCurrentStatus(member);
            return (
              <Card key={member.id}>
                <CardContent className="p-4 space-y-4">
                  {/* Member Info */}
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
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

                  {/* Plan and Fee */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Plan</p>
                      <p className="font-medium">{member.planName}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.planType}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Monthly Fee
                      </p>
                      <p className="font-medium">
                        {formatCurrency(member.monthlyFee)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
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

      {/* Payment History Dialog */}
      {selectedMember && (
        <MonthlyPaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          memberName={selectedMember.name}
          planType={selectedMember.planType}
          monthlyFee={selectedMember.monthlyFee}
          payments={selectedMember.payments}
          onUpdatePayment={handleUpdatePayment}
        />
      )}

      {/* Send Reminder Dialog */}
      {selectedMember && (
        <MonthlySendReminderDialog
          open={sendReminderDialogOpen}
          onOpenChange={setSendReminderDialogOpen}
          memberName={selectedMember.name}
          memberPhone={selectedMember.phone}
          memberEmail={selectedMember.email}
          planName={selectedMember.planName}
          planType={selectedMember.planType}
          monthlyFee={selectedMember.monthlyFee}
          month={selectedMonth}
        />
      )}

      {/* Bulk Reminders Dialog */}
      <MonthlyBulkReminderDialog
        open={bulkReminderDialogOpen}
        onOpenChange={setBulkReminderDialogOpen}
        pendingMembers={members
          .filter((m) => getMemberCurrentStatus(m) === "pending")
          .map((m) => ({
            id: m.id,
            name: m.name,
            phone: m.phone,
            email: m.email,
            avatar: m.avatar,
            planName: m.planName,
            planType: m.planType,
            monthlyFee: m.monthlyFee,
            month: selectedMonth,
          }))}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}

export default PaymentManagement;
