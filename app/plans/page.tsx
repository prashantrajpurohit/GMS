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

interface MembershipPlan {
  id: string;
  name: string;
  duration: "monthly" | "annual";
  price: number;
  features: string[];
  description: string;
  isActive: boolean;
}

const mockMembershipPlans: MembershipPlan[] = [
  {
    id: "1",
    name: "Basic Monthly",
    duration: "monthly",
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
    duration: "monthly",
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
    name: "Basic Annual",
    duration: "annual",
    price: 64000,
    features: [
      "All Basic Monthly features",
      "2 months free",
      "Priority booking",
    ],
    description: "Best value for committed fitness enthusiasts",
    isActive: true,
  },
  {
    id: "4",
    name: "Premium Annual",
    duration: "annual",
    price: 96000,
    features: [
      "All Premium Monthly features",
      "2 months free",
      "Guest passes",
      "Nutrition supplements discount",
    ],
    description: "Ultimate annual membership with maximum benefits",
    isActive: true,
  },
];

function WorkoutPlans() {
  const [isCreateMembershipOpen, setIsCreateMembershipOpen] = useState(false);
  const [isEditMembershipOpen, setIsEditMembershipOpen] = useState(false);
  const [editingMembershipPlan, setEditingMembershipPlan] =
    useState<MembershipPlan | null>(null);
  const [newMembershipPlan, setNewMembershipPlan] = useState({
    name: "",
    duration: "monthly" as "monthly" | "annual",
    price: "",
    features: "",
    description: "",
  });

  const handleCreateMembershipPlan = () => {
    console.log("Creating membership plan:", newMembershipPlan);
    setIsCreateMembershipOpen(false);
    setNewMembershipPlan({
      name: "",
      duration: "monthly",
      price: "",
      features: "",
      description: "",
    });
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

  const totalRevenue = mockMembershipPlans.reduce(
    (sum, plan) => sum + plan.price,
    0
  );
  const activePlans = mockMembershipPlans.filter((p) => p.isActive).length;

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
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  value={newMembershipPlan.name}
                  onChange={(e) =>
                    setNewMembershipPlan({
                      ...newMembershipPlan,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Premium Monthly"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={newMembershipPlan.duration}
                    onValueChange={(value: "monthly" | "annual") =>
                      setNewMembershipPlan({
                        ...newMembershipPlan,
                        duration: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newMembershipPlan.price}
                    onChange={(e) =>
                      setNewMembershipPlan({
                        ...newMembershipPlan,
                        price: e.target.value,
                      })
                    }
                    placeholder="6400"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea
                  id="features"
                  value={newMembershipPlan.features}
                  onChange={(e) =>
                    setNewMembershipPlan({
                      ...newMembershipPlan,
                      features: e.target.value,
                    })
                  }
                  placeholder="Access to gym equipment, Locker facility, Basic fitness assessment"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea
                  id="plan-description"
                  value={newMembershipPlan.description}
                  onChange={(e) =>
                    setNewMembershipPlan({
                      ...newMembershipPlan,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the plan..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateMembershipPlan}
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
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Plans</CardTitle>
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

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Revenue Potential</CardTitle>
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

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Members</CardTitle>
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
            className="border-border/50 hover:border-border transition-colors"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neon-green" />
                  <Badge
                    className={
                      plan.duration === "monthly"
                        ? "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
                        : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                    }
                  >
                    {plan.duration === "monthly" ? "Monthly" : "Annual"}
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
                  /{plan.duration === "monthly" ? "month" : "year"}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Select
                    value={editingMembershipPlan.duration}
                    onValueChange={(value: "monthly" | "annual") =>
                      setEditingMembershipPlan({
                        ...editingMembershipPlan,
                        duration: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
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
