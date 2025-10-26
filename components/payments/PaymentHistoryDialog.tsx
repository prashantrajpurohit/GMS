import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Download,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Clock,
} from 'lucide-react';

interface Payment {
  id: string;
  memberName: string;
  amount: number;
}

interface PaymentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank';
  transactionId?: string;
  status: 'paid' | 'late';
  lateFee?: number;
  discount?: number;
  notes?: string;
}

// Mock payment history
const mockHistory: PaymentRecord[] = [
  {
    id: 'PH001',
    date: '2025-10-01',
    amount: 2500,
    paymentMethod: 'upi',
    transactionId: 'UPI123456',
    status: 'paid',
  },
  {
    id: 'PH002',
    date: '2025-09-01',
    amount: 2500,
    paymentMethod: 'cash',
    status: 'paid',
  },
  {
    id: 'PH003',
    date: '2025-08-05',
    amount: 2600,
    paymentMethod: 'card',
    transactionId: 'CARD789012',
    status: 'late',
    lateFee: 100,
  },
  {
    id: 'PH004',
    date: '2025-07-01',
    amount: 2500,
    paymentMethod: 'bank',
    transactionId: 'BNK345678',
    status: 'paid',
  },
  {
    id: 'PH005',
    date: '2025-06-01',
    amount: 2300,
    paymentMethod: 'upi',
    transactionId: 'UPI654321',
    status: 'paid',
    discount: 200,
  },
];

export function PaymentHistoryDialog({
  open,
  onOpenChange,
  payment,
}: PaymentHistoryDialogProps) {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'upi':
        return <Smartphone className="w-4 h-4" />;
      case 'bank':
        return <Building2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  const getTotalPaid = () => {
    return mockHistory.reduce((sum, record) => sum + record.amount, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Payment History - {payment.memberName}</DialogTitle>
          <DialogDescription>
            Complete payment history and transaction records
          </DialogDescription>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Total Payments</p>
            <p className="text-lg font-semibold">{mockHistory.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-lg font-semibold">{formatCurrency(getTotalPaid())}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Late Payments</p>
            <p className="text-lg font-semibold">
              {mockHistory.filter((r) => r.status === 'late').length}
            </p>
          </div>
        </div>

        {/* Payment Timeline */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockHistory.map((record, index) => (
              <div key={record.id}>
                <div className="flex gap-4">
                  {/* Timeline Indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        record.status === 'paid'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {record.status === 'paid' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    {index < mockHistory.length - 1 && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>

                  {/* Payment Details */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{formatDate(record.date)}</p>
                          <Badge
                            variant="outline"
                            className={
                              record.status === 'paid'
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }
                          >
                            {record.status === 'paid' ? 'Paid' : 'Paid (Late)'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getPaymentMethodIcon(record.paymentMethod)}
                          <span>{getPaymentMethodLabel(record.paymentMethod)}</span>
                          {record.transactionId && (
                            <>
                              <span>•</span>
                              <span className="text-xs">ID: {record.transactionId}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(record.amount)}</p>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {(record.lateFee || record.discount || record.notes) && (
                      <div className="mt-2 p-3 bg-muted rounded-lg space-y-1 text-sm">
                        {record.lateFee && (
                          <div className="flex justify-between text-red-500">
                            <span>Late Fee:</span>
                            <span>+{formatCurrency(record.lateFee)}</span>
                          </div>
                        )}
                        {record.discount && (
                          <div className="flex justify-between text-green-500">
                            <span>Discount:</span>
                            <span>-{formatCurrency(record.discount)}</span>
                          </div>
                        )}
                        {record.notes && (
                          <p className="text-muted-foreground pt-2 border-t">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Receipt Download */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8 gap-1 text-neon-blue hover:text-neon-blue"
                    >
                      <Download className="w-3 h-3" />
                      Download Receipt
                    </Button>
                  </div>
                </div>
                {index < mockHistory.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Full History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
