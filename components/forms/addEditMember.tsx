import React from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

import CustomField from "../reusableComponents/customField";

import PlansController from "@/app/plans/controller";
import { useQuery } from "@tanstack/react-query";
import { MemberInterface } from "@/lib/validation-schemas";

export default function AddEditMember({
  isEditingMember,
}: {
  isEditingMember: Record<string, any> | null;
}) {
  const planController = new PlansController();

  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: planController.getPlans,
  });
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
      <div className="grid gap-3 sm:gap-4 py-3 sm:py-4 px-1 sm:px-0">
        <div className="grid gap-2">
          {/* <Label htmlFor="photo" className="text-sm sm:text-base">
            Member Photo
          </Label> */}
          {/* <div className="flex justify-center"> */}
          {/* <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                {photoWatch ? (
                  <Avatar src={ApiUrl. photoWatch} alt="Member photo" />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
              </div>

              <input
                id="photo"
                type="file"
                accept="image/*"
                ref={profileRef}
                className="hidden"
              />

              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 h-10 w-10 rounded-full border-2 border-background bg-neon-green hover:bg-neon-green/90"
                onClick={() => profileRef.current?.click()}
              >
                <Camera className="h-5 w-5 text-black" />
              </Button>

              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-0 right-0 h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div> */}
          {/* </div> */}
        </div>
        <div className="grid  gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <CustomField
                name="memberCode"
                label="Member Code"
                isLoading={false}
                placeholder="Enter member's code"
              />
            </div>
            <div>
              <CustomField
                name="fullName"
                label="Full name"
                isLoading={false}
                placeholder="Enter member's full name"
              />
            </div>
          </div>
          <div>
            <CustomField
              name="address"
              label="Address"
              isLoading={false}
              placeholder="Enter member's address"
            />
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
              <CustomField
                name="dateOfBirth"
                label="Date of Birth"
                isLoading={false}
                placeholder="dd-mm-yyyy"
                type="date"
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
            <CustomField
              name="startDate"
              label="Start Date"
              isLoading={false}
              placeholder="Select workout batch"
              type="date"
            />
          </div>{" "}
          <div className="grid gap-2">
            <CustomField
              name="endDate"
              label="End Date"
              isLoading={false}
              placeholder="Select workout batch"
              type="date"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
