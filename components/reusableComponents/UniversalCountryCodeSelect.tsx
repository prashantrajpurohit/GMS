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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface CountryCodeSelectProps {
  name: string;
  label?: string;
  form: UseFormReturn<any>;
  codes: string[];
  placeholder?: string;
}

export function CountryCodeSelect({
  name,
  label = "Country Code",
  form,
  codes,
  placeholder = "Select code...",
}: CountryCodeSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredCodes = codes.filter((code) => {
    const normalized = search.replace("+", "").toLowerCase();
    return (
      code.toLowerCase().includes(search.toLowerCase()) ||
      code.replace("+", "").includes(normalized)
    );
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[100px] justify-between"
                >
                  {field.value || placeholder}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="w-[130px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search code..."
                  value={search}
                  onValueChange={setSearch}
                />
                <CommandList>
                  <CommandEmpty>No code found.</CommandEmpty>
                  <CommandGroup>
                    {filteredCodes.map((code) => (
                      <CommandItem
                        key={code}
                        value={code}
                        onSelect={(selected) => {
                          form.setValue(name, selected);
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {code}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
