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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  UserCog,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Users,
  Award,
  Clock,
  Loader,
} from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import CustomField from "@/components/reusableComponents/customField";
import StaffController from "./controller";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffFormData, staffSchema } from "@/lib/validation-schemas";
import { Staff } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { addEditData } from "@/reduxstore/editIDataSlice";
import { StoreRootState } from "@/reduxstore/reduxStore";
import {
  ShimmerCard,
  StatsCardShimmer,
} from "@/components/reusableComponents/shimmer";
import { toast } from "sonner";

function StaffManagement() {
  const dispatch = useDispatch();
  const staffEditData = useSelector(
    (state: StoreRootState) => state.data.editData as Staff | null
  );
  const staffController = new StaffController();
  const queryClient = useQueryClient();
  const { data: roles = [], isLoading: isLoadingRoleOptions } = useQuery({
    queryKey: ["role"],
    queryFn: staffController.getRoles,
  });
  const { data: staffList = [], isLoading: isLoadingStaffList } = useQuery({
    queryKey: ["staffList"],
    queryFn: staffController.getStaffList,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: staffEditData
      ? staffController.updateStaff
      : staffController.addStaff,
    onSuccess: () => {
      toast.success(
        `Staff ${staffEditData?._id ? "updated" : "added"} successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      setIsCreateOpen(false);
    },
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [filterRole, setFilterRole] = useState<string>("all");

  const getRoleBadge = (role: Staff["role"]) => {
    switch (role.value) {
      case "head-coach":
        return (
          <Badge className="bg-neon-green/10 text-neon-green border-neon-green/20">
            Head Coach
          </Badge>
        );
      case "personal-trainer":
        return (
          <Badge className="bg-neon-blue/10 text-neon-blue border-neon-blue/20">
            Personal Trainer
          </Badge>
        );
      case "nutritionist":
        return (
          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Nutritionist
          </Badge>
        );
      case "receptionist":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Receptionist
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
        Inactive
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const onSubmit = (data: StaffFormData) => {
    mutate({ ...data, ...(staffEditData && { id: staffEditData?._id }) });
  };

  const filteredStaff =
    filterRole === "all"
      ? staffList
      : staffList.filter((s: Staff) => s.role.value === filterRole);

  const staffStats = {
    total: staffList.length,
    active: staffList.filter((s: Staff) => s.isActive).length,
    coaches: staffList.filter(
      (s: Staff) =>
        s.role.value === "head-coach" || s.role.value === "personal-trainer"
    ).length,
  };

  const form = useForm<StaffFormData>({
    values: {
      fullName: staffEditData?.fullName || "",
      role: staffEditData?.role?._id || "",
      email: staffEditData?.email || "",
      phone: staffEditData?.phone || "",
      specialization: staffEditData?.specialization || "",
      isActive: staffEditData?.isActive ? true : false || false,
      password: staffEditData?.password || "",
    },
    resolver: zodResolver(staffSchema),
  });
  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });
  function handleOpen(open: boolean) {
    dispatch(addEditData(null));
    form.reset();
    setIsCreateOpen(open);
  }
  function openEditDialog(staffMember: Staff) {
    setIsCreateOpen(true);
    dispatch(addEditData(staffMember));
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your gym coaches and staff members
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={handleOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-neon-green to-neon-blue text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Add a new coach or staff member to your gym team.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <CustomField
                      name="fullName"
                      label="Full Name"
                      isLoading={false}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomField
                      name="password"
                      label="Password"
                      isLoading={false}
                      placeholder="Enter Password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomField
                      name="role"
                      label="Role"
                      isLoading={isLoadingRoleOptions}
                      placeholder="Select role"
                      select
                      options={roles}
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomField
                      name="email"
                      label="Email"
                      isLoading={false}
                      placeholder="coach@gym.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomField
                      name="phone"
                      label="Phone"
                      isLoading={false}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomField
                      name="specialization"
                      label="Specialization"
                      isLoading={false}
                      placeholder="e.g., Strength Training, Yoga"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive">Active Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Mark this staff member as active
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      {...form.register("isActive")}
                      onCheckedChange={(c: boolean) =>
                        form.setValue("isActive", c)
                      }
                      checked={isActive}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
                  >
                    {isPending ? (
                      <Loader className="animate-spin h-6 w-6" />
                    ) : staffEditData ? (
                      "Update Staff Member"
                    ) : (
                      "Add Staff Member"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoadingStaffList ? (
          <>
            <StatsCardShimmer />
            <StatsCardShimmer />
            <StatsCardShimmer />
          </>
        ) : (
          <>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardDescription>Total Staff</CardDescription>
                <CardTitle className="text-3xl">{staffStats.total}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  All team members
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardDescription>Active Staff</CardDescription>
                <CardTitle className="text-3xl text-neon-green">
                  {staffStats.active}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Currently working
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardDescription>Trainers & Coaches</CardDescription>
                <CardTitle className="text-3xl text-neon-blue">
                  {staffStats.coaches}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" />
                  Training staff
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label>Filter by Role:</Label>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="head-coach">Head Coach</SelectItem>
            <SelectItem value="personal-trainer">Personal Trainer</SelectItem>
            <SelectItem value="nutritionist">Nutritionist</SelectItem>
            <SelectItem value="receptionist">Receptionist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingStaffList ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>
        ) : (
          <>
            {filteredStaff.map((staffMember: Staff) => (
              <Card
                key={staffMember._id}
                className="border-border/50 hover:border-border transition-colors"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={""} alt={staffMember.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-green/20 to-neon-blue/20 text-lg">
                        {getInitials(staffMember.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      {getRoleBadge(staffMember.role)}
                    </div>
                  </div>
                  <CardTitle className="text-xl">
                    {staffMember.fullName}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(staffMember.isActive)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{staffMember.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{staffMember.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {new Date(staffMember.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {staffMember.specialization && (
                    <div className="pt-3 border-t border-border">
                      <h4 className="text-sm mb-2 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Specialization
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {staffMember.specialization}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(staffMember)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default StaffManagement;
