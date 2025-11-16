"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import CustomField from "../reusableComponents/customField";
import { Button } from "../ui/button";
import { Camera, Loader, Loader2, Save, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import SettingsController from "@/app/settings/controller";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const UserProfileForm = () => {
  const settingsController = new SettingsController();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: settingsController.updateUserProfile,
    onSuccess: () => {
      toast.success("User Profile updated Successfully!!");
      queryClient.invalidateQueries({ queryKey: ["CurrentUserProfile"] });
    },
  });
  const { data } = useQuery({
    queryFn: settingsController.getUserProfile,
    queryKey: ["CurrentUserProfile"],
  });
  const currUserData = data?.data?.user || {};
  const handleSubmit = (data: Record<string, any>) => {
    mutate(data);
  };
  const form = useForm({
    values: {
      name: currUserData?.name || "",
      email: currUserData?.email || "",
      phone: currUserData?.phone || "",
    },
  });
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Profile Form */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <CustomField
              name="name"
              placeholder="Enter your name"
              isLoading={false}
              label="Full Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <CustomField
                name="email"
                placeholder="your@email.com"
                isLoading={false}
                label="Email"
              />
            </div>

            <div className="grid gap-2">
              <CustomField
                name="phone"
                placeholder="+91 98765 43210"
                isLoading={false}
                label="Phone"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button className="bg-gradient-to-r from-neon-green to-neon-blue text-white">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserProfileForm;
