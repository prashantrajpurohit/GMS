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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Plus,
  CreditCard,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import CustomField from "@/components/reusableComponents/customField";
import { FormProvider, useForm } from "react-hook-form";
import CustomTextarea from "@/components/reusableComponents/textArea";
import { useMutation } from "@tanstack/react-query";
import PlansController from "./controller";

interface MembershipPlan {
  id: string;
  name: string;
  duration: {
    value: number;
    unit: "days" | "months" | "years";
  };
  price: number;
  features: string[];
  description: string;
  isActive: boolean;
  freezeDays?: number; // Optional freeze days for longer plans
}

const mockMembershipPlans: MembershipPlan[] = [
  {
    id: "1",
    name: "Basic Monthly",
    duration: { value: 1, unit: "months" },
    price: 6400,
    features: [
      "Access to gym equipment",
      "Locker facility",
      "Basic fitness assessment",
    ],
    description: "Perfect for beginners starting their fitness journey",
    isActive: true,
  },
  {
    id: "2",
    name: "Premium Monthly",
    duration: { value: 1, unit: "months" },
    price: 12000,
    features: [
      "All Basic features",
      "Personal training sessions",
      "Diet consultation",
      "Group classes",
      "Steam & sauna",
    ],
    description: "Complete fitness package with personalized guidance",
    isActive: true,
  },
  {
    id: "3",
    name: "Half Year Package",
    duration: { value: 6, unit: "months" },
    price: 64000,
    features: [
      "All Basic Monthly features",
      "Priority booking",
      "Free gym merchandise",
    ],
    description: "Perfect for committed fitness enthusiasts",
    isActive: true,
    freezeDays: 7,
  },
  {
    id: "4",
    name: "Annual Premium",
    duration: { value: 1, unit: "years" },
    price: 96000,
    features: [
      "All Premium Monthly features",
      "2 months free",
      "Guest passes",
      "Nutrition supplements discount",
    ],
    description: "Ultimate annual membership with maximum benefits",
    isActive: true,
    freezeDays: 15,
  },
];

// Helper function to format duration display
const formatDuration = (duration: {
  value: number;
  unit: "days" | "months" | "years";
}) => {
  const { value, unit } = duration;
  if (value === 1) {
    // Singular form
    return unit === "days" ? "Day" : unit === "months" ? "Month" : "Year";
  }
  // Plural form
  return `${value} ${unit.charAt(0).toUpperCase() + unit.slice(1)}`;
};

// Helper function to get duration unit for display (e.g., /month, /year)
const getDurationUnit = (duration: {
  value: number;
  unit: "days" | "months" | "years";
}) => {
  if (duration.value === 1) {
    return duration.unit === "days"
      ? "day"
      : duration.unit === "months"
      ? "month"
      : "year";
  }
  return formatDuration(duration).toLowerCase();
};

function WorkoutPlans() {
  const planController = new PlansController();
  const { mutate } = useMutation({ mutationFn: planController.addPlan });

  const [isCreateMembershipOpen, setIsCreateMembershipOpen] = useState(false);
  const [isEditMembershipOpen, setIsEditMembershipOpen] = useState(false);
  const [editingMembershipPlan, setEditingMembershipPlan] =
    useState<MembershipPlan | null>(null);

  // Helper function to check if plan qualifies for freeze days (>= 6 months)
  const qualifiesForFreeze = (durationValue: string, durationUnit: string) => {
    const value = parseInt(durationValue) || 0;
    if (durationUnit === "years") return value >= 1;
    if (durationUnit === "months") return value >= 6;
    return false; // Days don't qualify
  };

  const handleEditMembershipPlan = () => {
    console.log("Updating membership plan:", editingMembershipPlan);
    setIsEditMembershipOpen(false);
    setEditingMembershipPlan(null);
  };

  const handleDeleteMembershipPlan = (planId: string) => {
    console.log("Deleting membership plan:", planId);
  };

  const openEditDialog = (plan: MembershipPlan) => {
    setEditingMembershipPlan(plan);
    setIsEditMembershipOpen(true);
  };
  const onSubmit = (data: any) => {
    mutate(data);
  };

  const totalRevenue = mockMembershipPlans.reduce(
    (sum, plan) => sum + plan.price,
    0
  );
  const activePlans = mockMembershipPlans.filter((p) => p.isActive).length;
  const form = useForm({
    defaultValues: {
      name: "",
      durationValue: "1",
      durationUnit: "months",
      price: "",
      features: "",
      description: "",
      freezeDays: "",
    },
  });

  const values = form.watch();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Membership Plans</h1>
          <p className="text-muted-foreground">
            Manage subscription plans for your gym members
          </p>
        </div>
        <Dialog
          open={isCreateMembershipOpen}
          onOpenChange={setIsCreateMembershipOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-neon-green to-neon-blue text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Membership Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Membership Plan</DialogTitle>
              <DialogDescription>
                Add a new subscription plan for your gym members.
              </DialogDescription>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <CustomField
                      name="name"
                      label="Plan Name"
                      placeholder="e.g., Premium Monthly"
                      isLoading={false}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <CustomField
                        name="durationValue"
                        label="Duration"
                        placeholder="Enter Duration"
                        isLoading={false}
                        type="number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <CustomField
                        name="durationUnit"
                        label="Unit"
                        placeholder="Select Unit"
                        isLoading={false}
                        options={["days", "months", "years"]}
                        select
                      />
                    </div>
                    <div className="grid gap-2">
                      <CustomField
                        name="price"
                        label="Price (₹)"
                        placeholder="6400"
                        isLoading={false}
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <CustomTextarea
                      name="features"
                      label="Features (comma separated)"
                      placeholder="Access to gym equipment, Locker facility, Basic fitness assessment"
                      isLoading={false}
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomTextarea
                      name="plan-description"
                      label="Description"
                      placeholder="Brief description of the plan..."
                      isLoading={false}
                    />
                  </div>
                  {qualifiesForFreeze(
                    values?.durationValue,
                    values?.durationUnit
                  ) && (
                    <div className="grid gap-2">
                      <CustomField
                        name="freeze-days"
                        label="Freeze Days (optional)"
                        placeholder="0"
                        isLoading={false}
                        type="number"
                      />
                      <p className="text-xs text-muted-foreground">
                        Number of days member can pause their membership
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </FormProvider>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
              >
                Create Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-neon-green/30 bg-gradient-to-br from-neon-green/10 to-neon-green/5 dark:bg-gradient-to-br dark:from-neon-green/20 dark:to-slate-800/50 hover:border-neon-green/60 hover:shadow-lg hover:shadow-neon-green/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-green" />
              Total Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-neon-green">
              {mockMembershipPlans.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {activePlans} active plans
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-neon-blue/30 bg-gradient-to-br from-neon-blue/10 to-neon-blue/5 dark:bg-gradient-to-br dark:from-neon-blue/20 dark:to-slate-800/50 hover:border-neon-blue/60 hover:shadow-lg hover:shadow-neon-blue/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neon-blue" />
              Total Revenue Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-neon-blue">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Combined plan values
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5 dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-slate-800/50 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-purple-400">156</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Across all plans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Membership Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMembershipPlans.map((plan) => (
          <Card
            key={plan.id}
            className="border-neon-green/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-green/50 dark:hover:border-neon-green/60 transition-all hover:shadow-lg hover:shadow-neon-green/10 dark:hover:shadow-neon-green/20 hover:bg-muted/40 dark:hover:bg-slate-800/70"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neon-green" />
                  <Badge
                    className={
                      plan.duration.unit === "months"
                        ? "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
                        : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                    }
                  >
                    {formatDuration(plan.duration)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMembershipPlan(plan.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl text-neon-green">
                ₹{plan.price.toLocaleString("en-IN")}
                <span className="text-sm text-muted-foreground">
                  /{getDurationUnit(plan.duration)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div>
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-neon-green mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2">
                <Badge
                  variant={plan.isActive ? "default" : "secondary"}
                  className={
                    plan.isActive
                      ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                      : ""
                  }
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Membership Plan Dialog */}
      <Dialog
        open={isEditMembershipOpen}
        onOpenChange={setIsEditMembershipOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Membership Plan</DialogTitle>
            <DialogDescription>
              Update the details of the membership plan.
            </DialogDescription>
          </DialogHeader>
          {editingMembershipPlan && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-plan-name">Plan Name</Label>
                <Input
                  id="edit-plan-name"
                  value={editingMembershipPlan.name}
                  onChange={(e) =>
                    setEditingMembershipPlan({
                      ...editingMembershipPlan,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Premium Monthly"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-duration-value">Duration</Label>
                  <Input
                    id="edit-duration-value"
                    type="number"
                    min="1"
                    value={editingMembershipPlan.duration.value}
                    onChange={(e) =>
                      setEditingMembershipPlan({
                        ...editingMembershipPlan,
                        duration: {
                          ...editingMembershipPlan.duration,
                          value: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-duration-unit">Unit</Label>
                  <Select
                    value={editingMembershipPlan.duration.unit}
                    onValueChange={(value: "days" | "months" | "years") =>
                      setEditingMembershipPlan({
                        ...editingMembershipPlan,
                        duration: {
                          ...editingMembershipPlan.duration,
                          unit: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingMembershipPlan.price}
                    onChange={(e) =>
                      setEditingMembershipPlan({
                        ...editingMembershipPlan,
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="6400"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-features">
                  Features (comma separated)
                </Label>
                <Textarea
                  id="edit-features"
                  value={editingMembershipPlan.features.join(", ")}
                  onChange={(e) =>
                    setEditingMembershipPlan({
                      ...editingMembershipPlan,
                      features: e.target.value.split(",").map((f) => f.trim()),
                    })
                  }
                  placeholder="Access to gym equipment, Locker facility, Basic fitness assessment"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-plan-description">Description</Label>
                <Textarea
                  id="edit-plan-description"
                  value={editingMembershipPlan.description}
                  onChange={(e) =>
                    setEditingMembershipPlan({
                      ...editingMembershipPlan,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the plan..."
                  rows={2}
                />
              </div>
              {qualifiesForFreeze(
                editingMembershipPlan.duration.value.toString(),
                editingMembershipPlan.duration.unit
              ) && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-freeze-days">
                    Freeze Days (optional)
                  </Label>
                  <Input
                    id="edit-freeze-days"
                    type="number"
                    min="0"
                    value={editingMembershipPlan.freezeDays || ""}
                    onChange={(e) =>
                      setEditingMembershipPlan({
                        ...editingMembershipPlan,
                        freezeDays: Number(e.target.value) || undefined,
                      })
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of days member can pause their membership
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditMembershipPlan}
              className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
            >
              Update Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WorkoutPlans;
