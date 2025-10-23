import { ChevronsUpDown, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
type Props = {
  name: string;
  placeholder: string;
  isLoading: boolean;
  options?: any[];
  label: string;
  free?: boolean;
  multiple?: boolean;
};
const Autocomplete = ({
  name,
  placeholder,
  options,
  label,
  free,
  multiple = false,
}: Props) => {
  const { control, setValue } = useFormContext();
  const [searchValue, setSearchValue] = useState<string>("");
  const oldData: string[] = useWatch({ control, name });
  const [open, setOpen] = useState<boolean>(false);
  const inputRef1 = useRef<HTMLInputElement>(null);
  function removeItem(ind: number) {
    const filteredData = oldData.filter(
      (_: any, index: number) => index !== ind
    );
    setValue(name, filteredData, { shouldValidate: true });
  }
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string
  ) {
    if (e.key == "Enter") {
      e.preventDefault();
      setValue(name, [...oldData, value], { shouldValidate: true });
      setSearchValue("");
    }
    if (e.key == "Backspace") {
      const copy = [...oldData];
      copy.pop();
      setValue(name, [...copy], { shouldValidate: true });
    }
  }
  function getFilteredOptions() {
    return options?.filter(
      (item) =>
        item.toLowerCase().includes(searchValue.toLowerCase()) &&
        !oldData.includes(item)
    );
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef1.current?.focus();
      }, 0);
    } else {
      inputRef1.current?.blur();
    }
  }, [open]);
  function handleSelect(data: string) {
    setValue(name, [...new Set([...oldData, data])]);
  }
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <div className="space-y-2">
              <FormLabel>{label}</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div>
                    <div
                      className={cn(
                        "flex min-h-10 w-full rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text",
                        fieldState.error
                          ? "border-destructive focus-within:ring-destructive/20"
                          : "border-input"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-1 flex-1">
                        {multiple ? (
                          oldData.map((item, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 text-xs cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(index);
                              }}
                            >
                              {item}
                              <X className="h-3 w-3 hover:bg-secondary-foreground/20 rounded" />
                            </Badge>
                          ))
                        ) : (
                          <div>{oldData[0]}</div>
                        )}
                        <input
                          {...field}
                          value={searchValue}
                          ref={inputRef1}
                          className="flex-1 outline-none bg-transparent min-w-[120px]"
                          placeholder={oldData.length === 0 ? placeholder : ""}
                          onChange={(e) => setSearchValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, searchValue)}
                        />
                      </div>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 self-center" />
                    </div>
                  </div>
                </PopoverTrigger>
                {!free && options!.length > 0 && (
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No frameworks found.</CommandEmpty>
                        <CommandGroup>
                          {getFilteredOptions()?.map((option, index) => (
                            <CommandItem
                              key={index}
                              onSelect={() => handleSelect(option)}
                            >
                              {option}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
              <FormMessage />
            </div>
          </>
        )}
      />
    </>
  );
};

export default Autocomplete;
