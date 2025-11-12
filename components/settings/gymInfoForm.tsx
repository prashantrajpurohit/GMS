"use client";
import React, { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Building2, Camera, Loader2, Save, Trash, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import CustomField from "../reusableComponents/customField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SettingsController from "@/app/settings/controller";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { ApiUrl } from "@/api/apiUrls";
import { Progress } from "../ui/progress";
import MembersController from "@/app/members/controller";
interface props {
  reduxUserData: Record<string, any> | null;
  settingsData: Record<string, any> | null;
  isLoading: boolean;
}
const GymInfoForm = ({ reduxUserData, settingsData, isLoading }: props) => {
  const logoInputRef = useRef(null);
  const queryClient = useQueryClient();
  const settingsController = new SettingsController();
  const memberController = new MembersController();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { mutate, isPending } = useMutation({
    mutationFn: settingsController.updateSettings,
    onSuccess: () => [
      queryClient.invalidateQueries({ queryKey: ["settingsData"] }),
      toast.success("Settings updated successfully!!"),
    ],
  });
  const { mutate: deleteMedia, isPending: isDeletePending } = useMutation({
    mutationFn: memberController.deleteMedia,
    onSuccess: () => {
      form.setValue("branding.logo", "");
    },
  });

  async function handleUploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    let file = e.target.files?.[0];
    if (!file) return;
    let url = null;
    setUploadingLogo(true);
    url = await memberController.uploadMedia(file, (p: number) =>
      setUploadProgress(p)
    );
    form.setValue("branding.logo", url);
    setUploadingLogo(false);
    logoInputRef.current!.value = "";
    setUploadProgress(0);
  }
  async function handleDelete() {
    deleteMedia(values?.branding?.logo);
  }
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
  const watchVal = form?.watch();
  const showSkeleton = isLoading || !settingsData;
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSaveGymSettings)}>
        <div className="space-y-4">
          <Label>Gym Logo</Label>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 my-4 ">
              {watchVal?.branding?.logo ? (
                <img
                  src={ApiUrl.IMAGE_BASE_URL + watchVal.branding?.logo}
                  alt="Member photo"
                  className="w-full h-full object-cover rounded-full border-2 border-muted"
                />
              ) : (
                <div
                  onClick={() => logoInputRef?.current?.click()}
                  className="w-full cursor-pointer h-full bg-muted rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center"
                >
                  <Camera className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}

              {/* Upload Progress */}
              {uploadingLogo && (
                <div className="absolute inset-0 bg-background/95 backdrop-blur rounded-lg flex flex-col items-center justify-center">
                  <Progress value={uploadProgress} className="h-2 w-20 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Upload/Delete Button */}
              {!watchVal?.branding?.logo ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              )}

              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleUploadLogo}
                ref={logoInputRef}
              />
            </div>
            <div className="space-y-2">
              Upload Logo
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
