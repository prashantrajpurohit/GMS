"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components//ui/tabs";
import { Switch } from "@/components//ui/switch";
import { Badge } from "@/components//ui/badge";
import { Building2, Clock, User } from "lucide-react";
import CustomField from "@/components/reusableComponents/customField";
import GymInfoForm from "@/components/settings/gymInfoForm";
import UserProfileForm from "@/components/settings/userProfileForm";
import GymTimingForm from "@/components/settings/gymTimingForm";
import SettingsController from "./controller";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/reduxStore";

function Settings() {
  const reduxUserData = useSelector(
    (state: StoreRootState) =>
      state?.data?.userdata?.user as Record<string, any> | null
  );

  const settingsController = new SettingsController();
  const { data, isLoading } = useQuery({
    queryKey: ["settingsData"],
    queryFn: () => settingsController.getAllSettings(reduxUserData?.gymId),
  });
  const settingsData = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your gym settings and preferences
        </p>
      </div>

      <Tabs defaultValue="gym-info" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 gap-3 mb-6 bg-transparent h-auto p-0">
          <TabsTrigger
            value="gym-info"
            className="gap-2 h-auto p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-green/20 data-[state=active]:to-neon-green/10 border-2 border-transparent data-[state=active]:border-neon-green/50 data-[state=active]:shadow-lg data-[state=active]:shadow-neon-green/20 rounded-lg hover:bg-muted/50 transition-all"
          >
            <Building2 className="w-5 h-5 data-[state=active]:text-neon-green" />
            <span className="hidden sm:inline">Gym Information</span>
            <span className="sm:hidden">Gym Info</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="timings"
            className="gap-2 h-auto p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-blue/20 data-[state=active]:to-neon-blue/10 border-2 border-transparent data-[state=active]:border-neon-blue/50 data-[state=active]:shadow-lg data-[state=active]:shadow-neon-blue/20 rounded-lg hover:bg-muted/50 transition-all"
          >
            <Clock className="w-5 h-5 data-[state=active]:text-neon-blue" />
            Timings
          </TabsTrigger> */}
          <TabsTrigger
            value="profile"
            className="gap-2 h-auto p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-purple-500/10 border-2 border-transparent data-[state=active]:border-purple-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 rounded-lg hover:bg-muted/50 transition-all"
          >
            <User className="w-5 h-5 data-[state=active]:text-purple-500" />
            <span className="hidden sm:inline">User Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gym-info">
          <Card className="border-neon-green/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-green/50 dark:hover:border-neon-green/60 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-neon-green" />
                <div>
                  <CardTitle>Gym Information</CardTitle>
                  <CardDescription>
                    Update your gym details and branding
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <GymInfoForm
                reduxUserData={reduxUserData}
                settingsData={settingsData}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gym Timings Tab */}
        {/* <TabsContent value="timings">
          <Card className="border-neon-blue/20 bg-muted/30 dark:bg-slate-800/50 hover:border-neon-blue/50 dark:hover:border-neon-blue/60 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-neon-blue" />
                <div>
                  <CardTitle>Gym Timings</CardTitle>
                  <CardDescription>
                    Configure operating days and time slots for member selection
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <GymTimingForm />
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* User Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-purple-500/20 bg-muted/30 dark:bg-slate-800/50 hover:border-purple-500/50 dark:hover:border-purple-500/60 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-500" />
                <div>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>
                    Manage your personal account settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <UserProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
