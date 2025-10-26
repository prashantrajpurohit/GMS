import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MessageSquare, Mail, Users } from "lucide-react";
import { toast } from "sonner";

interface PendingMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  planName: string;
  planType: string;
  monthlyFee: number;
  month: string;
}

interface MonthlyBulkReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingMembers: PendingMember[];
  selectedMonth: string;
}

export function MonthlyBulkReminderDialog({
  open,
  onOpenChange,
  pendingMembers,
  selectedMonth,
}: MonthlyBulkReminderDialogProps) {
  const [selectionMode, setSelectionMode] = useState<"all" | "custom">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sendVia, setSendVia] = useState<"whatsapp" | "email" | "both">(
    "whatsapp"
  );
  const [template, setTemplate] = useState("default");

  // Update selected IDs when selection mode changes
  React.useEffect(() => {
    if (selectionMode === "all") {
      setSelectedIds(new Set(pendingMembers.map((m) => m.id)));
    }
  }, [selectionMode, pendingMembers]);

  const handleToggleMember = (memberId: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(memberId)) {
      newSelectedIds.delete(memberId);
    } else {
      newSelectedIds.add(memberId);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(pendingMembers.map((m) => m.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const selectedMembers = useMemo(() => {
    return pendingMembers.filter((m) => selectedIds.has(m.id));
  }, [pendingMembers, selectedIds]);

  const totalAmount = useMemo(() => {
    return selectedMembers.reduce((sum, m) => sum + m.monthlyFee, 0);
  }, [selectedMembers]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const handleSend = () => {
    if (selectedMembers.length === 0) {
      toast.error("No members selected", {
        description: "Please select at least one member to send reminders",
      });
      return;
    }

    const channel =
      sendVia === "both"
        ? "WhatsApp and Email"
        : sendVia === "whatsapp"
        ? "WhatsApp"
        : "Email";

    toast.success(`Reminders sent successfully`, {
      description: `${selectedMembers.length} ${
        selectedMembers.length === 1 ? "reminder" : "reminders"
      } sent via ${channel} for ${selectedMonth}`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Send Bulk Payment Reminders
          </DialogTitle>
          <DialogDescription className="text-sm">
            Send reminders to members with pending payments for {selectedMonth}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selection Mode */}
          <div className="space-y-3">
            <Label>Select Members:</Label>
            <RadioGroup
              value={selectionMode}
              onValueChange={(value: any) => setSelectionMode(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label
                  htmlFor="all"
                  className="font-normal cursor-pointer text-sm"
                >
                  All Pending Members ({pendingMembers.length} members)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label
                  htmlFor="custom"
                  className="font-normal cursor-pointer text-sm"
                >
                  Custom Selection
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <Label>Members ({selectedMembers.length} selected):</Label>
              {selectionMode === "custom" && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="h-7 text-xs"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeselectAll}
                    className="h-7 text-xs"
                  >
                    Deselect All
                  </Button>
                </div>
              )}
            </div>

            <ScrollArea className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] border rounded-lg">
              <div className="p-2 sm:p-4 space-y-3">
                {pendingMembers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    No pending payments for {selectedMonth}
                  </p>
                ) : (
                  pendingMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Checkbox
                          checked={selectedIds.has(member.id)}
                          onCheckedChange={() => handleToggleMember(member.id)}
                          disabled={selectionMode !== "custom"}
                        />
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white text-sm">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                        <div className="text-left sm:text-right">
                          <p className="font-medium text-sm">
                            {formatCurrency(member.monthlyFee)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.planType}
                          </p>
                        </div>
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Send Options */}
          <div className="space-y-3">
            <Label>Send Via:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                type="button"
                variant={sendVia === "whatsapp" ? "default" : "outline"}
                onClick={() => setSendVia("whatsapp")}
                className={
                  sendVia === "whatsapp"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                type="button"
                variant={sendVia === "email" ? "default" : "outline"}
                onClick={() => setSendVia("email")}
                className={
                  sendVia === "email"
                    ? "bg-neon-blue hover:bg-neon-blue/90"
                    : ""
                }
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={sendVia === "both" ? "default" : "outline"}
                onClick={() => setSendVia("both")}
                className={
                  sendVia === "both"
                    ? "bg-gradient-to-r from-green-600 to-neon-blue hover:opacity-90 text-white"
                    : ""
                }
              >
                <Users className="w-4 h-4 mr-2" />
                Both
              </Button>
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="bulk-template">Template:</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger id="bulk-template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Reminder</SelectItem>
                <SelectItem value="friendly">Friendly Reminder</SelectItem>
                <SelectItem value="urgent">Urgent Notice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          {selectedMembers.length > 0 && (
            <div className="bg-muted p-3 sm:p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Selected Members:</span>
                <span className="font-medium">{selectedMembers.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount Due:</span>
                <span className="font-medium">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Month:</span>
                <span className="font-medium">{selectedMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Send Via:</span>
                <span className="font-medium">
                  {sendVia === "both"
                    ? "WhatsApp & Email"
                    : sendVia.charAt(0).toUpperCase() + sendVia.slice(1)}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={selectedMembers.length === 0}
            className="gap-2 bg-neon-green hover:bg-neon-green/90 text-black w-full sm:w-auto"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">
              Send to {selectedMembers.length} Selected
            </span>
            <span className="sm:hidden">Send ({selectedMembers.length})</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
