"use client";
import React, { useEffect, useState } from "react";
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
  Loader2,
  Loader,
} from "lucide-react";
import CustomField from "@/components/reusableComponents/customField";
import { FormProvider, useForm } from "react-hook-form";
import CustomTextarea from "@/components/reusableComponents/textArea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PlansController from "./controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanInterface, planSchema } from "@/lib/validation-schemas";
import Autocomplete from "@/components/reusableComponents/autocomplete";
import AddEditPlans from "@/components/forms/addEditPlans";
import { addEditData } from "@/reduxstore/editIDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/reduxStore";
import { toast } from "sonner";
import NoData from "@/components/reusableComponents/no-data";

// Helper function to format duration display
const formatDuration = (value: number, unit: "days" | "months" | "years") => {
  if (value === 1) {
    return unit === "days" ? "Day" : unit === "months" ? "Month" : "Year";
  }
  return `${value} ${unit?.charAt(0)?.toUpperCase() + unit?.slice(1)}`;
};

// Helper function to get duration unit for display (e.g., /month, /year)
const getDurationUnit = (value: number, unit: "days" | "months" | "years") => {
  if (value === 1) {
    return unit === "days" ? "day" : unit === "months" ? "month" : "year";
  }
  return formatDuration(value, unit).toLowerCase();
};
interface extendedPlanInterface extends PlanInterface {
  _id: string;
}
function WorkoutPlans() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const planController = new PlansController();
  const plansData = useSelector(
    (store: StoreRootState) =>
      store.data.editData as extendedPlanInterface | null
  );
  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: planController.getPlans,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      plansData
        ? planController.editPlan({ payload: data, _id: plansData?._id })
        : planController.addPlan(data),
    onSuccess() {
      toast.success(
        `Plan ${plansData?._id ? "updated" : "added"} successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setOpen(false);
      dispatch(addEditData(null));
      form.reset();
    },
  });
  const [mockMembershipPlans, setMockMembershipPlans] =
    useState<extendedPlanInterface[]>();
  const [open, setOpen] = useState(false);

  const openEditDialog = (plan: extendedPlanInterface) => {
    dispatch(addEditData(plan));
    setOpen(true);
  };
  const handleOpen = (open: boolean) => {
    setOpen(open);
    dispatch(addEditData(null));
  };
  const onSubmit = (data: any) => {
    mutate(data);
  };

  const totalRevenue = mockMembershipPlans?.reduce(
    (sum, plan) => sum + plan.price,
    0
  );
  const activePlans = mockMembershipPlans?.filter((p) => p.isActive).length;
  const form = useForm<PlanInterface>({
    defaultValues: {
      code: "",
      description: "",
      duration: 0,
      features: [],
      isActive: true,
      name: "",
      price: 0,
    },
    resolver: zodResolver(planSchema),
  });
  useEffect(() => {
    if (!plansData) return;
    form.reset(plansData);
  }, [plansData]);
  useEffect(() => {
    setMockMembershipPlans(data);
  }, [data]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Membership Plans</h1>
          <p className="text-muted-foreground">
            Manage subscription plans for your gym members
          </p>
        </div>
      </div>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-neon-green to-neon-blue text-white">
            <Plus className="w-4 h-4 mr-2" />
            {`${plansData ? "Edit" : "Add"} Membership Plan`}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AddEditPlans />
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
                >
                  {isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    `${plansData ? "Edit" : "Add"} Plan`
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
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
              {mockMembershipPlans?.length}
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
              ₹{totalRevenue?.toLocaleString("en-IN")}
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
            <div className="text-2xl text-purple-400">
              {mockMembershipPlans?.length ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Across all plans
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMembershipPlans?.length == 0 ? (
          <div className="col-span-full flex justify-center items-center min-h-[400px]">
            <NoData
              actionButton={
                <Button onClick={() => setOpen(true)}>Add First Plan</Button>
              }
            />
          </div>
        ) : (
          <>
            {mockMembershipPlans?.map((plan) => (
              <Card
                key={plan._id}
                className="border-neon-green/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-green/50 dark:hover:border-neon-green/60 transition-all hover:shadow-lg hover:shadow-neon-green/10 dark:hover:shadow-neon-green/20 hover:bg-muted/40 dark:hover:bg-slate-800/70"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-neon-green" />
                      <Badge
                        className={
                          plan.unit === "months"
                            ? "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
                            : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                        }
                      >
                        {formatDuration(plan.duration, plan.unit)}
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
                    </div>
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl text-neon-green">
                    ₹{plan.price.toLocaleString("en-IN")}
                    <span className="text-sm text-muted-foreground">
                      /{getDurationUnit(plan.duration, plan.unit)}
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
          </>
        )}
      </div>
    </div>
  );
}

export default WorkoutPlans;
