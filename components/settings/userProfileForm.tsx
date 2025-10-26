"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import CustomField from "../reusableComponents/customField";
import { Button } from "../ui/button";
import { Camera, Save, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

const UserProfileForm = () => {
  const [userProfile, setUserProfile] = useState({
    name: "Gym Owner",
    email: "owner@fitnesspro.com",
    phone: "+91 98765 43210",
    role: "Administrator",
    avatar: "",
  });
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setUserProfile({ ...userProfile, avatar: reader.result as string });
    //   };
    //   reader.readAsDataURL(file);
    // }
  };
  const handleSaveProfile = () => {};
  const form = useForm({
    defaultValues: {},
  });
  return (
    <FormProvider {...form}>
      <form>
        {/* Avatar Upload */}
        <div className="space-y-4">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile.avatar} alt="User Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-neon-green/20 to-neon-blue/20">
                <User className="w-8 h-8 text-neon-green" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Picture
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Profile Form */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <CustomField
              name="user-name"
              placeholder="Enter your name"
              isLoading={false}
              label="Full Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <CustomField
                name="user-email"
                placeholder="your@email.com"
                isLoading={false}
                label="Email"
              />
            </div>

            <div className="grid gap-2">
              <CustomField
                name="user-phone"
                placeholder="+91 98765 43210"
                isLoading={false}
                label="Phone"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <CustomField
              name="user-role"
              placeholder="Enter your role"
              isLoading={false}
              label="Role"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserProfileForm;
