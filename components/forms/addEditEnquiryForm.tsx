import { EnquiryFormData } from "@/lib/validation-schemas";
import { useFormContext } from "react-hook-form";
import CustomField from "../reusableComponents/customField";

const EnquiryForm = ({ isEditing }: { isEditing: boolean }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<EnquiryFormData>();

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <CustomField
          name="fullName"
          placeholder="Enter Full Name"
          isLoading={false}
          label="Name"
        />
      </div>

      <div className="space-y-2">
        <CustomField
          name="phone"
          placeholder="Enter 10-digit phone number"
          isLoading={false}
          label="Phone Number"
        />
      </div>

      <div className="space-y-2">
        <CustomField
          name="source"
          placeholder="e.g., Instagram, Facebook, Walk-in"
          isLoading={false}
          label="Source"
        />
      </div>

      <div className="space-y-2">
        <CustomField
          name="referredBy"
          placeholder="Enter referrer name"
          isLoading={false}
          label="Referred By"
        />
      </div>

      <div className="space-y-2">
        <CustomField
          name="status"
          placeholder="Select status"
          isLoading={false}
          label="Status"
          select={true}
          options={[
            "new",
            "contacted",
            "interested",
            "not_interested",
            "converted",
          ]}
        />
      </div>
    </div>
  );
};

export default EnquiryForm; 
