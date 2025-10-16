"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface TimezoneType {
  time_zone: string;
  name: string;
}

interface TimezoneSelectProps {
  name: string;
  label?: string;
  form: UseFormReturn<any>;
  timezones: TimezoneType[];
  placeholder?: string;
}

export function TimezoneSelect({
  name,
  label = "Timezone",
  form,
  timezones,
  placeholder = "Select timezone...",
}: TimezoneSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredTimezones = timezones.filter((tz) =>
    tz.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedName =
          timezones.find((tz) => tz.time_zone === field.value)?.name || "";

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedName || placeholder}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-[300px] p-0 ">
                <Command>
                  <CommandInput
                    placeholder="Search timezone..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No timezone found.</CommandEmpty>
                    <CommandGroup>
                      {filteredTimezones.map((tz) => (
                        <CommandItem
                          key={tz.time_zone}
                          value={tz.time_zone}
                          onSelect={() => {
                            form.setValue(name, tz.time_zone);
                            setOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === tz.time_zone ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {tz.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
