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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Send,
  Mail,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending";
  planType: string;
  paymentMethod?: string;
  paidDate?: string;
  remindersCount: number;
}

const initialPayments: Payment[] = [
  {
    id: "1",
    memberName: "John Smith",
    memberEmail: "john.smith@email.com",
    memberPhone: "+91 98765 43210",
    amount: 12000,
    dueDate: "2025-10-05",
    status: "paid",
    planType: "Premium Monthly",
    paymentMethod: "UPI",
    paidDate: "2025-10-04",
    remindersCount: 0,
  },
  {
    id: "2",
    memberName: "Sarah Johnson",
    memberEmail: "sarah.j@email.com",
    memberPhone: "+91 98765 43211",
    amount: 6400,
    dueDate: "2025-10-18",
    status: "pending",
    planType: "Basic Monthly",
    remindersCount: 3,
  },
  {
    id: "3",
    memberName: "Mike Wilson",
    memberEmail: "mike.wilson@email.com",
    memberPhone: "+91 98765 43212",
    amount: 12000,
    dueDate: "2025-10-22",
    status: "pending",
    planType: "Premium Monthly",
    remindersCount: 0,
  },
  {
    id: "4",
    memberName: "Emily Davis",
    memberEmail: "emily.davis@email.com",
    memberPhone: "+91 98765 43213",
    amount: 96000,
    dueDate: "2025-10-20",
    status: "pending",
    planType: "Premium Annual",
    remindersCount: 1,
  },
  {
    id: "5",
    memberName: "Alex Brown",
    memberEmail: "alex.brown@email.com",
    memberPhone: "+91 98765 43214",
    amount: 6400,
    dueDate: "2025-10-25",
    status: "pending",
    planType: "Basic Monthly",
    remindersCount: 2,
  },
  {
    id: "6",
    memberName: "Lisa Anderson",
    memberEmail: "lisa.a@email.com",
    memberPhone: "+91 98765 43215",
    amount: 12000,
    dueDate: "2025-10-15",
    status: "paid",
    planType: "Premium Monthly",
    paymentMethod: "Cash",
    paidDate: "2025-10-14",
    remindersCount: 0,
  },
  {
    id: "7",
    memberName: "David Martinez",
    memberEmail: "david.m@email.com",
    memberPhone: "+91 98765 43216",
    amount: 6400,
    dueDate: "2025-10-19",
    status: "pending",
    planType: "Basic Monthly",
    remindersCount: 1,
  },
  {
    id: "8",
    memberName: "Jessica Taylor",
    memberEmail: "jessica.t@email.com",
    memberPhone: "+91 98765 43217",
    amount: 12000,
    dueDate: "2025-10-07",
    status: "paid",
    planType: "Premium Monthly",
    paymentMethod: "Card",
    paidDate: "2025-10-06",
    remindersCount: 0,
  },
];

function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === "paid").length,
    pending: payments.filter((p) => p.status === "pending").length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            Pending
          </Badge>
        );
    }
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map((p) => p.id));
    }
  };

  const handleSendReminder = (
    payment: Payment,
    method: "email" | "whatsapp"
  ) => {
    // Increment reminder count
    setPayments((prevPayments) =>
      prevPayments.map((p) =>
        p.id === payment.id ? { ...p, remindersCount: p.remindersCount + 1 } : p
      )
    );

    const methodName = method === "email" ? "Email" : "WhatsApp";
    toast.success(`${methodName} reminder sent to ${payment.memberName}`, {
      description: `Payment reminder for ₹${payment.amount.toLocaleString()} sent successfully`,
    });
  };

  const handleSendBulkReminders = (method: "email" | "whatsapp") => {
    if (selectedPayments.length === 0) {
      toast.error("No payments selected", {
        description: "Please select at least one payment to send reminders",
      });
      return;
    }

    // Increment reminder count for selected payments
    setPayments((prevPayments) =>
      prevPayments.map((p) =>
        selectedPayments.includes(p.id)
          ? { ...p, remindersCount: p.remindersCount + 1 }
          : p
      )
    );

    const methodName = method === "email" ? "Email" : "WhatsApp";
    toast.success(`${methodName} reminders sent`, {
      description: `Sent ${selectedPayments.length} payment reminder(s) successfully`,
    });
    setSelectedPayments([]);
  };

  const handleSendReminderToAll = (method: "email" | "whatsapp") => {
    const pendingPayments = payments.filter((p) => p.status === "pending");

    // Increment reminder count for all pending payments
    setPayments((prevPayments) =>
      prevPayments.map((p) =>
        p.status === "pending"
          ? { ...p, remindersCount: p.remindersCount + 1 }
          : p
      )
    );

    const methodName = method === "email" ? "Email" : "WhatsApp";
    toast.success(`${methodName} reminders sent to all pending`, {
      description: `Sent reminders to ${pendingPayments.length} member(s) successfully`,
    });
  };

  const handleMarkAsPaid = (
    payment: Payment,
    paymentMethod: string = "Cash"
  ) => {
    setPayments((prevPayments) =>
      prevPayments.map((p) =>
        p.id === payment.id
          ? {
              ...p,
              status: "paid" as const,
              paidDate: new Date().toISOString().split("T")[0],
              paymentMethod: paymentMethod,
            }
          : p
      )
    );

    toast.success(`Payment marked as paid`, {
      description: `${
        payment.memberName
      }'s payment of ₹${payment.amount.toLocaleString()} has been recorded`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Payment Management</h1>
          <p className="text-muted-foreground">
            Track and manage membership payments
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              ₹{stats.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total} payment entries
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-neon-green">
              ₹{stats.paidAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.paid} payments received
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-500">
              ₹{stats.pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pending} pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>
                View and manage all payment transactions
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendReminderToAll("whatsapp")}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Send WhatsApp to All Pending
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendReminderToAll("email")}
              className="gap-2"
            >
              <Mail className="w-4 h-4" />
              Send Email to All Pending
            </Button>

            {selectedPayments.length > 0 && (
              <>
                <div className="hidden sm:block h-8 w-px bg-border mx-2" />
                <Badge variant="secondary" className="px-3 py-1.5">
                  {selectedPayments.length} Selected
                </Badge>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleSendBulkReminders("whatsapp")}
                  className="gap-2 bg-neon-green hover:bg-neon-green/90"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Selected
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleSendBulkReminders("email")}
                  className="gap-2 bg-neon-blue hover:bg-neon-blue/90"
                >
                  <Mail className="w-4 h-4" />
                  Email Selected
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedPayments.length === filteredPayments.length &&
                        filteredPayments.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead className="hidden md:table-cell">Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Due Date
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => {
                    const isSelected = selectedPayments.includes(payment.id);

                    return (
                      <TableRow
                        key={payment.id}
                        className={isSelected ? "bg-muted/50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleSelectPayment(payment.id)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {payment.memberName}
                            </div>
                            <div className="text-sm text-muted-foreground hidden sm:block">
                              {payment.memberEmail}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payment.memberPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{payment.planType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              ₹{payment.amount.toLocaleString()}
                            </div>
                            {payment.paymentMethod && (
                              <div className="text-sm text-muted-foreground">
                                via {payment.paymentMethod}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {new Date(payment.dueDate).toLocaleDateString()}
                            {payment.status === "paid" && payment.paidDate && (
                              <div className="text-xs text-neon-green">
                                Paid on{" "}
                                {new Date(
                                  payment.paidDate
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          {payment.status === "pending" ? (
                            <div className="flex flex-col items-end gap-2">
                              {payment.remindersCount > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Reminded {payment.remindersCount}{" "}
                                  {payment.remindersCount === 1
                                    ? "time"
                                    : "times"}
                                </div>
                              )}
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleMarkAsPaid(payment)}
                                className="bg-gradient-to-r from-neon-green to-neon-blue text-white hover:opacity-90"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Paid
                              </Button>
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSendReminder(payment, "whatsapp")
                                  }
                                  title="Send WhatsApp Reminder"
                                  className="hover:bg-neon-green/10 hover:text-neon-green"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSendReminder(payment, "email")
                                  }
                                  title="Send Email Reminder"
                                  className="hover:bg-neon-blue/10 hover:text-neon-blue"
                                >
                                  <Mail className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Payment completed
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentManagement;
