import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import PaymentController from "@/app/payments/controller";
import { useQuery } from "@tanstack/react-query";

export interface MonthlyPayment {
  month: string;
  status: "paid" | "pending";
  paymentDate?: string;
  amount: number;
}

interface MonthlyPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  planType: string;
  monthlyFee: number;
  selectedTrans: Record<string, any>;
  onUpdatePayment: (month: string, status: "paid" | "pending") => void;
}

export function MonthlyPaymentDialog({
  open,
  onOpenChange,
  memberName,
  planType,
  monthlyFee,
  selectedTrans,
  onUpdatePayment,
}: MonthlyPaymentDialogProps) {
  const paymentController = new PaymentController();
  const { data: paymentHistory } = useQuery({
    queryFn: () => paymentController.getPaymentHistoryById(selectedTrans?._id),
    queryKey: ["memberPaymentsHistory", selectedTrans?._id],
  });

  const formatCurrency = (amount: number) => {
    return `₹${amount?.toLocaleString("en-IN")}`;
  };
  const payments = paymentHistory?.payments || [];
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleTogglePayment = (
    month: string,
    currentStatus: "paid" | "pending"
  ) => {
    const newStatus = currentStatus === "paid" ? "pending" : "paid";
    onUpdatePayment(month, newStatus);
  };

  const paidCount = payments?.filter(
    (p) => p.status?.toLowerCase() === "paid"
  ).length;
  const totalPaid = payments
    ?.filter((p) => p.status?.toLowerCase() === "paid")
    ?.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Payment History - {memberName}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {planType} Plan • {formatCurrency(monthlyFee)}/month
          </DialogDescription>
        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Total Months</p>
            <p className="text-lg sm:text-xl font-semibold">
              {payments?.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Paid Months</p>
            <p className="text-lg sm:text-xl font-semibold text-green-500">
              {paidCount}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-lg sm:text-xl font-semibold">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: Record<string, any>) => (
                <TableRow key={payment.month}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatDate(payment.dueDate?.split("T")[0])}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    {payment.status?.toLowerCase() === "paid" ? (
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
                  <TableCell className="text-muted-foreground">
                    {formatDate(payment.updatedAt?.split("T")[0])}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={
                        payment.status?.toLowerCase() === "paid"
                          ? "outline"
                          : "default"
                      }
                      onClick={() =>
                        handleTogglePayment(payment.month, payment.status)
                      }
                      className={
                        payment.status?.toLowerCase() === "paid"
                          ? "text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          : "bg-neon-green hover:bg-neon-green/90 text-black"
                      }
                    >
                      {payment.status?.toLowerCase() === "paid"
                        ? "Mark Pending"
                        : "Mark Paid"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.month}
              className="p-4 border rounded-lg bg-card space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{payment.month}</span>
                </div>
                {payment.status === "paid" ? (
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
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Payment Date</p>
                  <p className="font-medium">
                    {formatDate(payment.paymentDate)}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant={payment.status === "paid" ? "outline" : "default"}
                onClick={() =>
                  handleTogglePayment(payment.month, payment.status)
                }
                className={`w-full ${
                  payment.status === "paid"
                    ? "text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    : "bg-neon-green hover:bg-neon-green/90 text-black"
                }`}
              >
                {payment.status === "paid" ? "Mark Pending" : "Mark Paid"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
