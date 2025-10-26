"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Building2, Save, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import CustomField from "../reusableComponents/customField";
const GymInfoForm = () => {
  const [gymSettings, setGymSettings] = useState({
    name: "FitnessPro Gym",
    email: "info@fitnesspro.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    website: "www.fitnesspro.com",
    logo: "",
    description:
      "Premier fitness center with state-of-the-art equipment and expert trainers",
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
  const handleSaveGymSettings = () => {};
  const form = useForm({
    defaultValues: {},
  });
  return (
    <FormProvider {...form}>
      <form>
        <div className="space-y-4">
          <Label>Gym Logo</Label>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 rounded-lg">
              <AvatarImage src={gymSettings.logo} alt="Gym Logo" />
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
              name="gym-name"
              placeholder="Enter gym name"
              isLoading={false}
              label="Gym Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <CustomField
                name="gym-email"
                placeholder="gym@email.com"
                isLoading={false}
                label="Email"
              />
            </div>

            <div className="grid gap-2">
              <CustomField
                name="gym-phone"
                placeholder="+91 98765 43210"
                isLoading={false}
                label="Phone"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <CustomField
              name="gym-address"
              placeholder="Enter gym address"
              isLoading={false}
              label="Address"
            />
          </div>

          <div className="grid gap-2">
            <CustomField
              name="gym-website"
              placeholder="www.yourgym.com"
              isLoading={false}
              label="Website"
            />
          </div>
          <div className="grid gap-2">
            <CustomField
              name="gym-description"
              placeholder="Brief description about your gym"
              isLoading={false}
              label="Description"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSaveGymSettings}
            className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Gym Information
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default GymInfoForm;
