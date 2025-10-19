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
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import CustomField from "@/components/reusableComponents/customField";
import StaffController from "./controller";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffFormData, staffSchema } from "@/lib/validation-schemas";

interface Staff {
  id: string;
  name: string;
  role: "head-coach" | "personal-trainer" | "nutritionist" | "receptionist";
  email: string;
  phone: string;
  joinDate: string;
  specialization?: string;
  avatar?: string;
  isActive: boolean;
  assignedMembers?: number;
}

const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "head-coach",
    email: "rajesh.kumar@gym.com",
    phone: "+91 98765 43210",
    joinDate: "2023-01-15",
    specialization: "Strength Training, CrossFit",
    isActive: true,
    assignedMembers: 25,
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "personal-trainer",
    email: "priya.sharma@gym.com",
    phone: "+91 98765 43211",
    joinDate: "2023-03-20",
    specialization: "Weight Loss, Cardio",
    isActive: true,
    assignedMembers: 15,
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "nutritionist",
    email: "amit.patel@gym.com",
    phone: "+91 98765 43212",
    joinDate: "2023-05-10",
    specialization: "Sports Nutrition, Meal Planning",
    isActive: true,
    assignedMembers: 30,
  },
  {
    id: "4",
    name: "Sneha Reddy",
    role: "personal-trainer",
    email: "sneha.reddy@gym.com",
    phone: "+91 98765 43213",
    joinDate: "2023-07-01",
    specialization: "Yoga, Flexibility Training",
    isActive: true,
    assignedMembers: 12,
  },
];

const roleOptions = [
  {
    name: "Head Coach",
    value: "head-coach",
  },
  {
    name: "Personal Trainer",
    value: "personal-trainer",
  },
  {
    name: "Nutritionist",
    value: "nutritionist",
  },
  {
    name: "Receptionist",
    value: "receptionist",
  },
];

function StaffManagement() {
  const staffController = new StaffController();
  const { mutate } = useMutation({
    mutationFn: staffController.addStaff,
  });
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");

  const getRoleBadge = (role: Staff["role"]) => {
    switch (role) {
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

  const handleEditStaff = () => {
    if (editingStaff) {
      setStaff(staff.map((s) => (s.id === editingStaff.id ? editingStaff : s)));
      setIsEditOpen(false);
      setEditingStaff(null);
    }
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  const openEditDialog = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setIsEditOpen(true);
  };
  const onSubmit = (data: any) => {
    mutate(data);
  };

  const filteredStaff =
    filterRole === "all" ? staff : staff.filter((s) => s.role === filterRole);

  const staffStats = {
    total: staff.length,
    active: staff.filter((s) => s.isActive).length,
    coaches: staff.filter(
      (s) => s.role === "head-coach" || s.role === "personal-trainer"
    ).length,
  };

  const form = useForm<StaffFormData>({
    defaultValues: {
      name: "",
      role: "personal-trainer",
      email: "",
      phone: "",
      specialization: "",
      isActive: true,
    },
    resolver: zodResolver(staffSchema),
  });

  const values = form.watch();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your gym coaches and staff members
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
                      name="name"
                      label="Full Name"
                      isLoading={false}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomField
                      name="role"
                      label="Role"
                      isLoading={false}
                      placeholder="Select role"
                      select
                      options={roleOptions}
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
                      defaultChecked={values.isActive}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
                  >
                    Add Staff Member
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        {filteredStaff.map((staffMember) => (
          <Card
            key={staffMember.id}
            className="border-border/50 hover:border-border transition-colors"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={staffMember.avatar}
                    alt={staffMember.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-neon-green/20 to-neon-blue/20 text-lg">
                    {getInitials(staffMember.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  {getRoleBadge(staffMember.role)}
                </div>
              </div>
              <CardTitle className="text-xl">{staffMember.name}</CardTitle>
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
                    Joined {new Date(staffMember.joinDate).toLocaleDateString()}
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

              {staffMember.assignedMembers !== undefined && (
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Assigned Members
                    </span>
                    <Badge variant="secondary">
                      {staffMember.assignedMembers}
                    </Badge>
                  </div>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => handleDeleteStaff(staffMember.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update staff member information.
            </DialogDescription>
          </DialogHeader>
          {editingStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingStaff.name}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingStaff.role}
                  onValueChange={(value: Staff["role"]) =>
                    setEditingStaff({ ...editingStaff, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="head-coach">Head Coach</SelectItem>
                    <SelectItem value="personal-trainer">
                      Personal Trainer
                    </SelectItem>
                    <SelectItem value="nutritionist">Nutritionist</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingStaff.email}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingStaff.phone}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, phone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-specialization">Specialization</Label>
                <Input
                  id="edit-specialization"
                  value={editingStaff.specialization || ""}
                  onChange={(e) =>
                    setEditingStaff({
                      ...editingStaff,
                      specialization: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-isActive">Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Mark this staff member as active
                  </p>
                </div>
                <Switch
                  id="edit-isActive"
                  checked={editingStaff.isActive}
                  onCheckedChange={(checked) =>
                    setEditingStaff({ ...editingStaff, isActive: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditStaff}
              className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
            >
              Update Staff Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StaffManagement;
