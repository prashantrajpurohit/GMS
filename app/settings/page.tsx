"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";
import { Button } from "@/components//ui/button";
import { Input } from "@/components//ui/input";
import { Label } from "@/components//ui/label";
import { Textarea } from "@/components//ui/textarea";
import { Separator } from "@/components//ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components//ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components//ui/tabs";
import { Switch } from "@/components//ui/switch";
import { Badge } from "@/components//ui/badge";
import {
  Building2,
  Clock,
  User,
  Mail,
  Phone,
  Upload,
  MapPin,
  Globe,
  Save,
  Camera,
  Plus,
  X,
} from "lucide-react";

function Settings() {
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

  const [activeDays, setActiveDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });

  const [timeSlots, setTimeSlots] = useState([
    { id: 1, name: "Morning", startTime: "06:00", endTime: "12:00" },
    { id: 2, name: "Afternoon", startTime: "12:00", endTime: "17:00" },
    { id: 3, name: "Evening", startTime: "17:00", endTime: "22:00" },
  ]);

  const [userProfile, setUserProfile] = useState({
    name: "Gym Owner",
    email: "owner@fitnesspro.com",
    phone: "+91 98765 43210",
    role: "Administrator",
    avatar: "",
  });

  const handleSaveGymSettings = () => {
    console.log("Saving gym settings:", gymSettings);
  };

  const handleSaveTimings = () => {
    // console.log("Saving timings:", timings);
  };

  const handleSaveProfile = () => {
    console.log("Saving user profile:", userProfile);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGymSettings({ ...gymSettings, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your gym settings and preferences
        </p>
      </div>

      <Tabs defaultValue="gym-info" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-transparent h-auto p-0">
          <TabsTrigger
            value="gym-info"
            className="gap-2 h-auto p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-green/20 data-[state=active]:to-neon-green/10 border-2 border-transparent data-[state=active]:border-neon-green/50 data-[state=active]:shadow-lg data-[state=active]:shadow-neon-green/20 rounded-lg hover:bg-muted/50 transition-all"
          >
            <Building2 className="w-5 h-5 data-[state=active]:text-neon-green" />
            <span className="hidden sm:inline">Gym Information</span>
            <span className="sm:hidden">Gym Info</span>
          </TabsTrigger>
          <TabsTrigger
            value="timings"
            className="gap-2 h-auto p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-blue/20 data-[state=active]:to-neon-blue/10 border-2 border-transparent data-[state=active]:border-neon-blue/50 data-[state=active]:shadow-lg data-[state=active]:shadow-neon-blue/20 rounded-lg hover:bg-muted/50 transition-all"
          >
            <Clock className="w-5 h-5 data-[state=active]:text-neon-blue" />
            Timings
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="gap-2 h-auto p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-purple-500/10 border-2 border-transparent data-[state=active]:border-purple-500/50 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 rounded-lg hover:bg-muted/50 transition-all"
          >
            <User className="w-5 h-5 data-[state=active]:text-purple-500" />
            <span className="hidden sm:inline">User Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
        </TabsList>

        {/* Gym Information Tab */}
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
              {/* Logo Upload */}
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
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
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
                  <Label htmlFor="gym-name">Gym Name</Label>
                  <Input
                    id="gym-name"
                    value={gymSettings.name}
                    onChange={(e) =>
                      setGymSettings({ ...gymSettings, name: e.target.value })
                    }
                    placeholder="Enter gym name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="gym-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="gym-email"
                        type="email"
                        value={gymSettings.email}
                        onChange={(e) =>
                          setGymSettings({
                            ...gymSettings,
                            email: e.target.value,
                          })
                        }
                        placeholder="gym@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="gym-phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="gym-phone"
                        value={gymSettings.phone}
                        onChange={(e) =>
                          setGymSettings({
                            ...gymSettings,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 98765 43210"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gym-address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="gym-address"
                      value={gymSettings.address}
                      onChange={(e) =>
                        setGymSettings({
                          ...gymSettings,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter gym address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gym-website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="gym-website"
                      value={gymSettings.website}
                      onChange={(e) =>
                        setGymSettings({
                          ...gymSettings,
                          website: e.target.value,
                        })
                      }
                      placeholder="www.yourgym.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gym-description">Description</Label>
                  <Textarea
                    id="gym-description"
                    value={gymSettings.description}
                    onChange={(e) =>
                      setGymSettings({
                        ...gymSettings,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description about your gym"
                    rows={3}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gym Timings Tab */}
        <TabsContent value="timings">
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
              {/* Operating Days */}
              <div className="space-y-3">
                <Label>Operating Days</Label>
                <p className="text-sm text-muted-foreground">
                  Select the days your gym is open
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "monday", label: "Mon" },
                    { key: "tuesday", label: "Tue" },
                    { key: "wednesday", label: "Wed" },
                    { key: "thursday", label: "Thu" },
                    { key: "friday", label: "Fri" },
                    { key: "saturday", label: "Sat" },
                    { key: "sunday", label: "Sun" },
                  ].map((day) => (
                    <Button
                      key={day.key}
                      variant={
                        activeDays[day.key as keyof typeof activeDays]
                          ? "default"
                          : "outline"
                      }
                      className={
                        activeDays[day.key as keyof typeof activeDays]
                          ? "bg-gradient-to-r from-neon-green to-neon-blue text-white hover:opacity-90"
                          : ""
                      }
                      onClick={() =>
                        setActiveDays({
                          ...activeDays,
                          [day.key]:
                            !activeDays[day.key as keyof typeof activeDays],
                        })
                      }
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">
                    Active Days:{" "}
                    {Object.values(activeDays).filter(Boolean).length} / 7
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Time Slots */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Time Slots</Label>
                    <p className="text-sm text-muted-foreground">
                      Define time slots for member preferences
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newId =
                        Math.max(...timeSlots.map((s) => s.id), 0) + 1;
                      setTimeSlots([
                        ...timeSlots,
                        {
                          id: newId,
                          name: `Slot ${newId}`,
                          startTime: "09:00",
                          endTime: "12:00",
                        },
                      ]);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                </div>

                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="grid gap-3 p-4 border border-border/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          value={slot.name}
                          onChange={(e) =>
                            setTimeSlots(
                              timeSlots.map((s) =>
                                s.id === slot.id
                                  ? { ...s, name: e.target.value }
                                  : s
                              )
                            )
                          }
                          placeholder="Slot name (e.g., Morning)"
                          className="max-w-[200px]"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setTimeSlots(
                              timeSlots.filter((s) => s.id !== slot.id)
                            )
                          }
                          disabled={timeSlots.length === 1}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label
                            htmlFor={`slot-${slot.id}-start`}
                            className="text-sm text-muted-foreground"
                          >
                            Start Time
                          </Label>
                          <Input
                            id={`slot-${slot.id}-start`}
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              setTimeSlots(
                                timeSlots.map((s) =>
                                  s.id === slot.id
                                    ? { ...s, startTime: e.target.value }
                                    : s
                                )
                              )
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label
                            htmlFor={`slot-${slot.id}-end`}
                            className="text-sm text-muted-foreground"
                          >
                            End Time
                          </Label>
                          <Input
                            id={`slot-${slot.id}-end`}
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              setTimeSlots(
                                timeSlots.map((s) =>
                                  s.id === slot.id
                                    ? { ...s, endTime: e.target.value }
                                    : s
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    💡 Members will select their preferred time slot when
                    registering or updating their profile. These slots will be
                    available for all operating days.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveTimings}
                  className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Timings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    value={userProfile.name}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, name: e.target.value })
                    }
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="user-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="user-email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            email: e.target.value,
                          })
                        }
                        placeholder="your@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="user-phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="user-phone"
                        value={userProfile.phone}
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 98765 43210"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Input
                    id="user-role"
                    value={userProfile.role}
                    disabled
                    className="bg-muted"
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
