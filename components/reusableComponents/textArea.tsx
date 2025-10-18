import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
type CommonProps = {
  name: string;
  label: string;
  placeholder: string;
  isLoading: boolean;
  disabled?: boolean;
};

const CustomTextarea = ({
  name,
  label,
  placeholder,
  isLoading,
  disabled = false,
}: CommonProps) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          {isLoading ? (
            <Skeleton className="h-4 w-[250px]" />
          ) : (
            <FormLabel>{label}</FormLabel>
          )}

          <FormControl>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <Textarea
                className="w-full"
                disabled={disabled}
                placeholder={placeholder}
                {...field}
                onChange={field.onChange}
              />
            )}
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomTextarea;
