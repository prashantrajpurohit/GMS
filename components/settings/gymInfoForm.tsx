"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Building2, Loader2, Save, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import CustomField from "../reusableComponents/customField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SettingsController from "@/app/settings/controller";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
interface props {
  reduxUserData: Record<string, any> | null;
  settingsData: Record<string, any> | null;
  isLoading: boolean;
}
const GymInfoForm = ({ reduxUserData, settingsData, isLoading }: props) => {
  const queryClient = useQueryClient();
  const settingsController = new SettingsController();
  const { mutate, isPending } = useMutation({
    mutationFn: settingsController.updateSettings,
    onSuccess: () => [
      queryClient.invalidateQueries({ queryKey: ["settingsData"] }),
      toast.success("Settings updated successfully!!"),
    ],
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setGymSettings({ ...gymSettings, logo: reader.result as string });
    //   };
    //   reader.readAsDataURL(file);
    // }
  };
  const handleSaveGymSettings = (data: Record<string, any>) => {
    mutate({ gymId: reduxUserData?.gymId, payload: data });
  };

  const form = useForm({
    defaultValues: {
      name: settingsData?.name || "",
      address: settingsData?.address || "",
      branding: settingsData?.settings?.branding || {
        website: "",
        logo: "",
        description: "",
      },
    },
  });

  React.useEffect(() => {
    if (settingsData) {
      form.reset({
        name: settingsData?.name || "",
        address: settingsData?.address || "",
        branding: settingsData?.settings?.branding || {
          website: "",
          logo: "",
          description: "",
        },
      });
    }
  }, [settingsData]);

  const values = form.getValues();
  const showSkeleton = isLoading || !settingsData;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSaveGymSettings)}>
        <div className="space-y-4">
          <Label>Gym Logo</Label>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 rounded-lg">
              <AvatarImage src={values?.branding?.logo} alt="Gym Logo" />
              <AvatarFallback className="bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-lg">
                <Building2 className="w-10 h-10 text-neon-green" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>
        </div>
        <Separator />
        {/* Gym Details Form */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <CustomField
              name="name"
              placeholder="Enter gym name"
              isLoading={showSkeleton}
              label="Gym Name"
            />
          </div>

          <div className="grid gap-2">
            <CustomField
              name="address"
              placeholder="Enter gym address"
              isLoading={showSkeleton}
              label="Address"
            />
          </div>

          <div className="grid gap-2">
            <CustomField
              name="branding.website"
              placeholder="www.yourgym.com"
              isLoading={showSkeleton}
              label="Website"
            />
          </div>
          <div className="grid gap-2">
            <CustomField
              name="branding.description"
              placeholder="Brief description about your gym"
              isLoading={showSkeleton}
              label="Description"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSaveGymSettings}
            disabled={isPending}
            className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Gym Information
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default GymInfoForm;
