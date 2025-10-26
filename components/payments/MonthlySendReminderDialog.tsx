import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Mail, Send } from "lucide-react";
import { toast } from "sonner";

interface MonthlySendReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  memberPhone: string;
  memberEmail: string;
  monthlyFee: number;
  planName: string;
  planType: string;
  month: string;
}

export function MonthlySendReminderDialog({
  open,
  onOpenChange,
  memberName,
  memberPhone,
  memberEmail,
  monthlyFee,
  planName,
  planType,
  month,
}: MonthlySendReminderDialogProps) {
  const [whatsappTemplate, setWhatsappTemplate] = useState("default");
  const [emailTemplate, setEmailTemplate] = useState("professional");
  const [includePaymentLink, setIncludePaymentLink] = useState(false);
  const [attachInvoice, setAttachInvoice] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getWhatsappMessage = () => {
    switch (whatsappTemplate) {
      case "default":
        return `Hi ${memberName},\n\nYour membership payment for ${month} is pending.\n\nAmount: ${formatCurrency(
          monthlyFee
        )}\nPlan: ${planName} (${planType})\n\nPay via:\nUPI: gym@upi\nAccount: XXXX1234\n\n- FitnessPro Gym`;
      case "friendly":
        return `Hello ${memberName}! 👋\n\nJust a friendly reminder that your ${planType} ${planName} payment for ${month} is pending.\n\nAmount: ${formatCurrency(
          monthlyFee
        )}\n\nLooking forward to seeing you at the gym! 💪\n\n- FitnessPro Team`;
      case "urgent":
        return `⚠️ PAYMENT REMINDER\n\nDear ${memberName},\n\nYour membership payment for ${month} is still pending.\n\nAmount: ${formatCurrency(
          monthlyFee
        )}\nPlan: ${planName}\n\nPlease make the payment immediately to continue enjoying our services.\n\nUPI: gym@upi\nAccount: XXXX1234\n\n- FitnessPro Gym`;
      default:
        return "";
    }
  };

  const getEmailSubject = () => {
    switch (emailTemplate) {
      case "professional":
        return `Payment Reminder for ${month} - FitnessPro Gym`;
      case "friendly":
        return `💪 Friendly Reminder: ${month} Membership Payment`;
      case "urgent":
        return `⚠️ Urgent: Pending Payment for ${month}`;
      default:
        return "";
    }
  };

  const getEmailPreview = () => {
    switch (emailTemplate) {
      case "professional":
        return (
          <>
            <p className="mb-2">Dear {memberName},</p>
            <p className="mb-4">
              This is a friendly reminder that your membership payment for{" "}
              {month} is pending.
            </p>
            <div className="bg-muted p-3 rounded mb-4 space-y-1">
              <p>
                <strong>Amount Due:</strong> {formatCurrency(monthlyFee)}
              </p>
              <p>
                <strong>Month:</strong> {month}
              </p>
              <p>
                <strong>Plan:</strong> {planName} - {planType}
              </p>
            </div>
            <p className="mb-4">
              Please make the payment at your earliest convenience to continue
              enjoying our services.
            </p>
            <p className="text-sm text-muted-foreground">
              Best regards,
              <br />
              FitnessPro Gym Team
            </p>
          </>
        );
      case "friendly":
        return (
          <>
            <p className="mb-2">Hi {memberName}! 👋</p>
            <p className="mb-4">
              Hope you're crushing your fitness goals! Just a quick heads up
              that your membership payment for {month} is pending.
            </p>
            <div className="bg-muted p-3 rounded mb-4 space-y-1">
              <p>
                <strong>Amount:</strong> {formatCurrency(monthlyFee)}
              </p>
              <p>
                <strong>Month:</strong> {month}
              </p>
              <p>
                <strong>Plan:</strong> {planName}
              </p>
            </div>
            <p className="mb-4">
              We can't wait to see you at the gym! Keep up the great work! 💪
            </p>
            <p className="text-sm text-muted-foreground">
              Cheers,
              <br />
              Team FitnessPro
            </p>
          </>
        );
      case "urgent":
        return (
          <>
            <p className="mb-2 text-red-500 font-medium">
              ⚠️ URGENT: Payment Pending
            </p>
            <p className="mb-2">Dear {memberName},</p>
            <p className="mb-4">
              Our records indicate that your membership payment for {month} is
              still pending.
            </p>
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded mb-4 space-y-1">
              <p>
                <strong>Amount Due:</strong> {formatCurrency(monthlyFee)}
              </p>
              <p>
                <strong>Month:</strong> {month}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-red-500">Pending</span>
              </p>
            </div>
            <p className="mb-4">
              Please make the payment immediately to avoid service interruption.
            </p>
            <p className="text-sm text-muted-foreground">
              Regards,
              <br />
              FitnessPro Gym Management
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const handleSendWhatsApp = () => {
    const message = getWhatsappMessage();
    const phoneNumber = memberPhone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    toast.success("WhatsApp reminder sent", {
      description: `Reminder sent to ${memberName} for ${month}`,
    });

    onOpenChange(false);
  };

  const handleSendEmail = () => {
    toast.success("Email reminder sent", {
      description: `Email sent to ${memberEmail} for ${month}`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Send Payment Reminder
          </DialogTitle>
          <DialogDescription className="text-sm">
            Send a payment reminder to {memberName} for {month}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
          </TabsList>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-4">
            <div className="space-y-2">
              <Label>To:</Label>
              <p className="text-sm">
                {memberName} ({memberPhone})
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp-template">Template</Label>
              <Select
                value={whatsappTemplate}
                onValueChange={setWhatsappTemplate}
              >
                <SelectTrigger id="whatsapp-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Reminder</SelectItem>
                  <SelectItem value="friendly">Friendly Reminder</SelectItem>
                  <SelectItem value="urgent">Urgent Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message Preview:</Label>
              <div className="bg-muted p-4 rounded-lg border">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {getWhatsappMessage()}
                </pre>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="payment-link"
                checked={includePaymentLink}
                onCheckedChange={(checked) =>
                  setIncludePaymentLink(checked as boolean)
                }
              />
              <Label
                htmlFor="payment-link"
                className="font-normal cursor-pointer text-sm"
              >
                Include payment link
              </Label>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendWhatsApp}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                Send WhatsApp
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label>To:</Label>
              <p className="text-sm">{memberEmail}</p>
            </div>

            <div className="space-y-2">
              <Label>Subject:</Label>
              <p className="text-sm font-medium">{getEmailSubject()}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-template">Template</Label>
              <Select value={emailTemplate} onValueChange={setEmailTemplate}>
                <SelectTrigger id="email-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Email Preview:</Label>
              <div className="bg-card border rounded-lg p-6 max-h-[300px] overflow-y-auto">
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-neon-blue rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">FP</span>
                  </div>
                  <div>
                    <p className="font-semibold">FitnessPro Gym</p>
                    <p className="text-xs text-muted-foreground">
                      gym@fitnesspro.com
                    </p>
                  </div>
                </div>
                <div className="text-sm">{getEmailPreview()}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="attach-invoice"
                checked={attachInvoice}
                onCheckedChange={(checked) =>
                  setAttachInvoice(checked as boolean)
                }
              />
              <Label
                htmlFor="attach-invoice"
                className="font-normal cursor-pointer text-sm"
              >
                Attach invoice PDF
              </Label>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                className="gap-2 bg-neon-blue hover:bg-neon-blue/90 w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                Send Email
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
