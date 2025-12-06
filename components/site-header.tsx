"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, SearchIcon, Phone, Users, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { ModeToggle } from "./ui/mode-toggler";
import { CommonContoller } from "@/lib/controller/httpApis";
import { useDebounce } from "@/hooks/use-debounce";
import { EnquiriesResponse, Enquiry } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnquiryFormData {
  name: string;
  phone: string;
  source?: string;
  referredBy?: string;
  status?: string;
}

export function SiteHeader({ name }: { name?: string }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 300);

  const commonController = new CommonContoller();

  const [open, setOpen] = useState(false);
  const { data, isLoading, isSuccess } = useQuery<EnquiriesResponse>({
    queryKey: ["search-enquiries", debouncedQuery],
    queryFn: () => commonController.searchEnquiries(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });
  const enquiries = data?.enquiries ?? [];
  const [selectedEnquiry, setSelectedEnquiry] = useState<
    (Enquiry & { createdAt?: string | Date; updatedAt?: string | Date }) | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEnquiryOpen, setIsAddEnquiryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<EnquiryFormData>();

  useEffect(() => {
    if (!query.trim()) {
      setOpen(false);
    } else if (isSuccess) {
      setOpen(true);
    }
  }, [query, enquiries]);

  const getEnquiryLabel = (enquiry: Enquiry) =>
    enquiry.name ||
    enquiry.phone ||
    enquiry.source ||
    enquiry.referredBy ||
    enquiry.status;

  const handleSuggestionClick = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
    setOpen(false);
    setQuery("");
  };

  const handleAddNewEnquiry = () => {
    setIsAddEnquiryOpen(true);
    setOpen(false);
    setQuery("");
  };

  const onSubmit = (data: EnquiryFormData) => {
    console.log("Form submitted:", data);
    // Add your API call here to create the enquiry
    setIsAddEnquiryOpen(false);
    form.reset();
  };

  const closeWithDelay = () => {
    blurTimeout.current = setTimeout(() => setOpen(false), 100);
  };

  const openIfHasInput = () => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
    if (query.trim() || enquiries.length > 0) {
      setOpen(true);
    }
  };

  const showSuggestionBox =
    open && (isLoading || enquiries.length > 0 || query.trim().length > 0);

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      contacted:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      converted:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          statusColors[status.toLowerCase()] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{name ?? "GYM"}</h1>
        <div className="ml-auto flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search enquiries"
              aria-label="Search enquiries"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={openIfHasInput}
              onBlur={closeWithDelay}
              ref={inputRef}
              className="h-9 w-full pl-9"
            />
            {showSuggestionBox && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-md border bg-background shadow-lg">
                <div className="max-h-64 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Fetching enquiries...
                    </div>
                  ) : enquiries?.length > 0 ? (
                    <ul className="divide-y divide-border">
                      {enquiries?.map((enquiry, index) => {
                        const label = getEnquiryLabel(enquiry);
                        const meta = [
                          enquiry.source,
                          enquiry.status,
                          enquiry.referredBy,
                        ]
                          .filter(Boolean)
                          .join(" | ");
                        const key = `${
                          enquiry.phone ?? enquiry.name ?? index
                        }-${index}`;
                        return (
                          <li
                            key={key}
                            className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              handleSuggestionClick(enquiry);
                            }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium">
                                {label || "Untitled enquiry"}
                              </span>
                              {enquiry.phone ? (
                                <span className="text-xs text-muted-foreground">
                                  {enquiry.phone}
                                </span>
                              ) : null}
                            </div>
                            {meta ? (
                              <p className="text-xs text-muted-foreground">
                                {meta}
                              </p>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleAddNewEnquiry();
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span>No enquiries found.</span>
                        <Button className="font-medium text-foreground">
                          Add new enquiry?
                        </Button>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* View Enquiry Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Enquiry Details
            </DialogTitle>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{selectedEnquiry.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(selectedEnquiry.status)}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Phone Number
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{selectedEnquiry.phone}</p>
                </div>
              </div>

              {selectedEnquiry.source && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Source</p>
                  <p className="font-medium">{selectedEnquiry.source}</p>
                </div>
              )}

              {selectedEnquiry.referredBy && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Referred By
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{selectedEnquiry.referredBy}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Created At
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">
                      {new Date(
                        selectedEnquiry?.createdAt as string
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Last Updated
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">
                      {new Date(
                        selectedEnquiry.updatedAt as string
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Enquiry Modal */}
      <Dialog open={isAddEnquiryOpen} onOpenChange={setIsAddEnquiryOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Enquiry</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    {...form.register("name", { required: "Name is required" })}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    {...form.register("phone", {
                      required: "Phone number is required",
                    })}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Instagram, Facebook, Walk-in"
                    {...form.register("source")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referredBy">Referred By</Label>
                  <Input
                    id="referredBy"
                    placeholder="Enter referrer name"
                    {...form.register("referredBy")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => form.setValue("status", value)}
                    defaultValue="new"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="not_interested">
                        Not Interested
                      </SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-neon-green to-neon-blue text-white"
                >
                  Add Enquiry
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </header>
  );
}
