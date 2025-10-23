import React from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

import CustomField from "../reusableComponents/customField";
import Autocomplete from "../reusableComponents/autocomplete";
import CustomTextarea from "../reusableComponents/textArea";

export default function AddEditPlans() {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Create Membership Plan</DialogTitle>
        <DialogDescription>
          Add a new subscription plan for your gym members.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <CustomField
              name="name"
              label="Plan Name"
              placeholder="e.g., Premium Monthly"
              isLoading={false}
            />
          </div>
          <div>
            <CustomField
              name="code"
              label="Plan Code"
              placeholder="e.g., PREM-MONTHLY"
              isLoading={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <CustomField
              name="duration"
              label="Duration"
              placeholder="Enter Duration"
              isLoading={false}
              type="number"
            />
          </div>
          <div className="grid gap-2">
            <CustomField
              name="unit"
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
          <Autocomplete
            isLoading={false}
            name="features"
            label="Features"
            free
            multiple
            placeholder="Enter Features"
          />
        </div>
        <div className="grid gap-2">
          <CustomTextarea
            name="description"
            label="Description"
            placeholder="Brief description of the plan..."
            isLoading={false}
          />
        </div>
        {/* {qualifiesForFreeze(
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
                  )} */}
      </div>
    </div>
  );
}
