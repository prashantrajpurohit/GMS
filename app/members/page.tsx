"use client";
import React, { useEffect, useRef, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Phone,
  Mail,
  User,
  CreditCard,
  X,
  Camera,
  Image,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import CustomField from "@/components/reusableComponents/customField";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberInterface, memberSchema } from "@/lib/validation-schemas";
import MembersController from "./controller";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImportMembersDialog } from "@/components/ImportMembersDialog";
import PlansController from "../plans/controller";
import AddEditMember from "@/components/forms/addEditMember";

interface extendedMemberInterface extends MemberInterface {
  _id: string;
}
function MembershipManagement() {
  const memberController = new MembersController();
  const { mutate, isPending } = useMutation({
    mutationFn: memberController.addMember,
    onSuccess: () => {
      setIsAddMemberOpen(false);
    },
  });
  const { data } = useQuery({
    queryKey: ["members"],
    queryFn: memberController.getAllMembers,
  });

  const [members, setMembers] = useState<extendedMemberInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [billingMember, setBillingMember] = useState<MemberInterface | null>(
    null
  );

  const filteredMembers = members?.filter((member) => {
    const matchesSearch =
      member?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-neon-green/10 text-neon-green border-neon-green/20">
            Active
          </Badge>
        );
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewProfile = (member: extendedMemberInterface) => {};

  const handleViewBilling = (member: MemberInterface) => {
    setBillingMember(member);
    setIsBillingOpen(true);
  };

  const handleUpdatePayment = () => {
    // In a real app, this would process payment
    // console.log("Processing payment for:", billingMember?.name);
    // setIsBillingOpen(false);
    // if (billingMember) {
    //   const updatedMember = { ...billingMember, status: "active" };
    //   setMembers(
    //     members.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    //   );
    //   toast.success("Payment processed successfully!");
    // }
  };

  const handleImportComplete = (importedMembers: any[]) => {
    console.log("Imported members:", importedMembers);
    // In a real app, this would save the members to the database
    // For now, we'll just log them
    setMembers([
      ...members,
      ...importedMembers?.map((m, index) => ({
        ...m,
        id: (members?.length + index + 1).toString(),
      })),
    ]);
    toast.success("Members imported successfully!");
  };

  const memberCounts = {
    all: members?.length,
    active: members?.filter((m) => m.status === "ACTIVE").length,
    expired: members?.filter((m) => m.status === "INACTIVE").length,
    pending: members?.filter((m) => m.status === "SUSPENDED").length,
  };

  const onSubmit = (data: MemberInterface) => {
    mutate(data);
  };

  const form = useForm<MemberInterface>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      weight: 0,
      height: 0,
      currentPlanId: "",
      startDate: "",
      photo: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      emergencyContact: "8989898989",
      endDate: "",
      memberCode: "",
      status: "ACTIVE",
      notes: "",
      batch: "",
    },
    resolver: zodResolver(memberSchema),
  });
  useEffect(() => {
    setMembers(data);
  }, [data]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Membership Management</h1>
          <p className="text-muted-foreground">
            Manage gym members, plans, and renewals
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <ImportMembersDialog onImportComplete={handleImportComplete} />

          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-neon-green to-neon-blue text-white flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add New Member</span>
                <span className="sm:hidden">Add Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AddEditMember />

                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 px-1 sm:px-0">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-neon-green to-neon-blue text-white order-2 sm:order-1"
                    >
                      {isPending ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : (
                        "Add Member"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </FormProvider>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Billing Management Dialog */}
      <Dialog open={isBillingOpen} onOpenChange={setIsBillingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Billing Management</DialogTitle>
            <DialogDescription>
              Manage payment and billing information for{" "}
              {billingMember?.fullName}
            </DialogDescription>
          </DialogHeader>

          {billingMember && (
            <div className="grid gap-6 py-4">
              {/* Member Info */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center text-white">
                  {billingMember.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{billingMember.fullName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {billingMember.currentPlanId}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Payment Information</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Plan</Label>
                    <p className="text-sm text-muted-foreground">
                      {billingMember.currentPlanId}
                    </p>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <p className="text-sm text-neon-green font-medium">
                      ₹{billingMember.amount ?? 0}
                    </p>
                  </div>
                  <div>
                    <Label>Last Payment</Label>
                    <p className="text-sm text-muted-foreground">
                      {billingMember.endDate
                        ? new Date(billingMember.endDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Next Billing</Label>
                    <p className="text-sm text-muted-foreground">
                      {billingMember.startDate
                        ? new Date(billingMember.startDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="space-y-3">
                <h4 className="font-medium">Payment Status</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(billingMember.status)}
                    <span className="text-sm">
                      {billingMember.status === "ACTIVE" &&
                        "Payment up to date"}
                      {billingMember.status === "INACTIVE" &&
                        "Payment required - membership expired"}
                      {billingMember.status === "SUSPENDED" &&
                        "Payment pending verification"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium">Quick Actions</h4>
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                      console.log(
                        "Processing payment for:",
                        billingMember.fullName
                      )
                    }
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Process Payment
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() =>
                      console.log(
                        "Sending payment reminder to:",
                        billingMember.email
                      )
                    }
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Payment Reminder
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Update Billing Date
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBillingOpen(false)}>
              Close
            </Button>
            <Button
              onClick={handleUpdatePayment}
              className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
            >
              Update Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search and Filter */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Members ({memberCounts.all})
                  </SelectItem>
                  <SelectItem value="active">
                    Active ({memberCounts.active})
                  </SelectItem>
                  <SelectItem value="expired">
                    Expired ({memberCounts.expired})
                  </SelectItem>
                  <SelectItem value="pending">
                    Pending ({memberCounts.pending})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Members ({filteredMembers?.length})</CardTitle>
          <CardDescription>
            {selectedFilter === "all"
              ? "All registered members"
              : `Members with ${selectedFilter} status`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Contact
                  </TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="hidden md:table-cell">Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers?.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center text-white text-sm">
                          {member.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{member.fullName}</div>
                          <div className="text-sm text-muted-foreground sm:hidden">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {member.currentPlanId}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{member.amount ?? 0}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="text-sm">
                          {new Date(member.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          to {new Date(member.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProfile(member)}
                          className="hover:bg-neon-green/10 hover:text-neon-green"
                        >
                          <User className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBilling(member)}
                          className="hover:bg-neon-blue/10 hover:text-neon-blue"
                        >
                          <CreditCard className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Renewal This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-neon-green">23 members</div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated revenue: ₹2,76,000
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">New Members (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-neon-blue">18 members</div>
            <p className="text-xs text-muted-foreground mt-1">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-purple-400">87%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Above industry average
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MembershipManagement;
