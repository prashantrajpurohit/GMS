"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DatePickerField({
  name,
  label,
  placeholder = "dd-mm-yyyy",
  disabled,
}: {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { setValue, watch } = useFormContext();
  const fieldValue = watch(name);

  const dateValue = fieldValue ? new Date(fieldValue) : null;
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateValue && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, "dd-MM-yyyy") : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 z-[9999]"
          side="bottom"
          align="start"
          //   avoidCollisions={false}
          collisionPadding={10}
        >
          {/* THE EXTREME FIX → ALWAYS WORKS */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault(); // stops dialog, stops parent components catching click
            }}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto"
          >
            <Calendar
              mode="single"
              selected={dateValue ?? undefined}
              initialFocus
              onSelect={(date) => {
                if (!date) return;
                setValue(name, date.toISOString(), { shouldValidate: true });
                setOpen(false);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
