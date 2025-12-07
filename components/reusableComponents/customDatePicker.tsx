"use client";

import { useFormContext } from "react-hook-form";
import DatePicker from "react-date-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

export default function DatePickerField({
  name,
  minDate,
  label,
  placeholder = "dd-mm-yyyy",
  disabled,
}: {
  minDate: Date;
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { setValue, watch } = useFormContext();
  const fieldValue = watch(name);

  const parseDate = (value: any): Date | null => {
    if (!value) return null;

    if (value instanceof Date && !isNaN(value.getTime())) {
      return value;
    }

    if (typeof value === "string") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    return null;
  };

  const dateValue = parseDate(fieldValue);

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>

      <div className="relative">
        <DatePicker
          // selected={dateValue}
          onChange={(date) => {
            if (date && date instanceof Date && !isNaN(date.getTime())) {
              setValue(name, date.toISOString(), { shouldValidate: true });
            }
          }}
          maxDate={minDate}
          // dateFormat="dd-MM-yyyy"
          // placeholderText={placeholder}
          disabled={disabled}
          // showYearDropdown
          // showMonthDropdown
          // dropdownMode="select"
          // yearDropdownItemNumber={6}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background pl-10",
            !dateValue && "text-muted-foreground"
          )}
        />
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}
