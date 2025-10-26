"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomField from "../reusableComponents/customField";
import { Clock, Plus, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const GymTimingForm = () => {
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
  const handleSaveTimings = () => {
    // console.log("Saving timings:", timings);
  };
  const form = useForm({
    defaultValues: {},
  });
  return (
    <FormProvider {...form}>
      <form>
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
                    [day.key]: !activeDays[day.key as keyof typeof activeDays],
                  })
                }
              >
                {day.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              Active Days: {Object.values(activeDays).filter(Boolean).length} /
              7
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
                const newId = Math.max(...timeSlots.map((s) => s.id), 0) + 1;
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
                          s.id === slot.id ? { ...s, name: e.target.value } : s
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
                      setTimeSlots(timeSlots.filter((s) => s.id !== slot.id))
                    }
                    disabled={timeSlots.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <CustomField
                      name={`slot-${slot.id}-start`}
                      placeholder="Enter gym start time"
                      isLoading={false}
                      label="Start Time"
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomField
                      name={`slot-${slot.id}-end`}
                      placeholder="Enter gym end time"
                      isLoading={false}
                      label="End Time"
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
              💡 Members will select their preferred time slot when registering
              or updating their profile. These slots will be available for all
              operating days.
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
      </form>
    </FormProvider>
  );
};

export default GymTimingForm;
