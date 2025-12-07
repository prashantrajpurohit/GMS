import React, { useRef, useState } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

import CustomField from "../reusableComponents/customField";

import PlansController from "@/app/plans/controller";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/reduxStore";
import { Button } from "../ui/button";
import { Camera, Loader2, Trash } from "lucide-react";
import MembersController from "@/app/members/controller";
import { Progress } from "../ui/progress";
import { ApiUrl } from "@/api/apiUrls";
import { useFormContext } from "react-hook-form";

import { Skeleton } from "@/components/ui/skeleton";
import DatePickerField from "../reusableComponents/customDatePicker";
import { toast } from "sonner";

// Add this component at the top
const FormFieldsSkeleton = () => (
  <div className="grid gap-3 sm:gap-4 py-3 sm:py-4 px-1 sm:px-0">
    {/* Image skeleton */}
    <div className="flex justify-center">
      <Skeleton className="w-32 h-32 rounded-full" />
    </div>

    {/* Full name skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>

    {/* Address skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </div>

    {/* Email and Phone skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>

    {/* DOB and Gender skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>

    {/* Weight and Height skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>

    {/* Plan and Batch skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>

    {/* Start Date and Status skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  </div>
);

// Separate component for image upload to isolate re-renders
const ImageUploadSection = () => {
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const memberController = new MembersController();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const form = useFormContext();

  // Only watch the photo field, not all fields
  const photoValue = form.watch("photo");

  const { mutate: deleteMedia, isPending } = useMutation({
    mutationFn: memberController.deleteMedia,
    onSuccess: () => {
      form.setValue("photo", "");
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

    form.setValue("photo", url);
    setUploadingLogo(false);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
    setUploadProgress(0);
  }

  async function handleDelete() {
    deleteMedia(photoValue);
  }

  return (
    <div className="relative w-32 h-32 mx-auto">
      {photoValue ? (
        <img
          src={ApiUrl.IMAGE_BASE_URL + photoValue}
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
          <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
        </div>
      )}

      {/* Upload/Delete Button */}
      {!photoValue ? (
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
  );
};

export default function AddEditMember({
  isEditingMember,
}: {
  isEditingMember: Record<string, any> | null;
}) {
  const form = useFormContext();

  const planController = new PlansController();
  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: planController.getPlans,
  });
  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear - 5, 0, 1);

  return (
    <div>
      <DialogHeader className="px-1 sm:px-0">
        <DialogTitle className="text-lg sm:text-xl">
          {isEditingMember ? "Update Member profile" : "Add New Member"}
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base">
          {isEditingMember
            ? "Update the member's information below."
            : "Add a new member to your gym. Fill in all the required information."}
        </DialogDescription>
      </DialogHeader>
      {isLoading ? (
        <FormFieldsSkeleton />
      ) : (
        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4 px-1 sm:px-0">
          {/* Image Upload Section - Now isolated */}
          <ImageUploadSection />

          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <CustomField
                  name="fullName"
                  label="Full name"
                  isLoading={false}
                  placeholder="Enter member's full name"
                />
              </div>
              <div>
                <CustomField
                  name="fatherName"
                  label="Father name"
                  isLoading={false}
                  placeholder="Enter member's father name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <CustomField
                  name="address"
                  label="Address"
                  isLoading={false}
                  placeholder="Enter member's address"
                />
              </div>
              <div>
                <CustomField
                  name="registrationNo"
                  label="Registration No"
                  isLoading={false}
                  placeholder="Enter member's registration no"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <CustomField
                  name="email"
                  label="Email"
                  isLoading={false}
                  placeholder="member@example.com"
                />
              </div>

              <div>
                <CustomField
                  name="phone"
                  label="Phone"
                  isLoading={false}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <DatePickerField
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="dd-mm-yyyy"
                  minDate={minDate}
                />
              </div>

              <div>
                <CustomField
                  name="gender"
                  label="Gender"
                  isLoading={false}
                  placeholder="Select gender"
                  select
                  options={["male", "female", "other"]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <CustomField
                  name="weight"
                  label="Weight (kg)"
                  isLoading={false}
                  placeholder="Enter weight in kg"
                  type="number"
                  step="0.1"
                />
              </div>

              <div>
                <CustomField
                  name="height"
                  label="Height (cm)"
                  isLoading={false}
                  placeholder="Enter height in cm"
                  type="number"
                  step="0.1"
                />
              </div>
            </div>
          </div>
          {/* Plan and Batch Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="grid gap-2">
              <CustomField
                name="currentPlanId"
                label="Plan Type"
                isLoading={isLoading}
                placeholder="Select plan type"
                select
                options={data}
              />
            </div>

            <div className="grid gap-2">
              <CustomField
                name="batch"
                label="Workout Batch"
                isLoading={false}
                placeholder="Select workout batch"
                select
                options={["morning", "evening"]}
              />
            </div>
          </div>
          {/* Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="grid gap-2">
              <DatePickerField
                minDate={new Date()}
                name="startDate"
                label="Start Date"
                placeholder="Select workout batch"
              />
            </div>
            <div>
              <CustomField
                name="status"
                label="Status"
                isLoading={false}
                placeholder="Select status"
                select
                options={["active", "expired", "inactive"]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
