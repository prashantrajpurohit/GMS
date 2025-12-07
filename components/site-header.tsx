"use client";
import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  SearchIcon,
  Phone,
  Users,
  Calendar,
  Loader,
  Plus,
  SearchX,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useRouter } from "next/navigation";
import EnquiryForm from "./forms/addEditEnquiryForm";
import EnquiriesController from "@/app/enquiry/controller";
import { toast } from "sonner";
import { initialFormValues } from "@/app/enquiry/page";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnquiryFormData, enquirySchema } from "@/lib/validation-schemas";

export function SiteHeader({ name }: { name?: string }) {
  const enquiryController = new EnquiriesController();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 300);
  const router = useRouter();
  const commonController = new CommonContoller();

  const [open, setOpen] = useState(false);
  const { data, isLoading, isSuccess } = useQuery<[Enquiry]>({
    queryKey: ["search-enquiries", debouncedQuery],
    queryFn: () => commonController.searchEnquiries(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });
  const enquiries = data ?? [];
  const { mutate, isPending } = useMutation({
    mutationFn: enquiryController.addEnquiry,
    onSuccess: () => {
      setIsAddEnquiryOpen(false);
      queryClient.invalidateQueries({ queryKey: ["enquiries-list"] });
      toast.success(`Enquiry added successfully!`);
      form.reset(initialFormValues);
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to save enquiry. Please try again."
      );
    },
  });
  const { mutate: convertMutate, isPending: convertLoading } = useMutation({
    mutationFn: enquiryController.convertToLead,
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["enquiries-list"] });
      toast.success(`Member added successfully!`);
      form.reset(initialFormValues);
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to save enquiry. Please try again."
      );
    },
  });
  const [selectedEnquiry, setSelectedEnquiry] = useState<
    (Enquiry & { createdAt?: string | Date; updatedAt?: string | Date }) | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEnquiryOpen, setIsAddEnquiryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<EnquiryFormData>({
    defaultValues: { ...initialFormValues },
    resolver: zodResolver(enquirySchema),
    mode: "onChange", // Validates on change for better UX
  });

  useEffect(() => {
    if (!query.trim()) {
      setOpen(false);
    } else if (isSuccess) {
      setOpen(true);
    }
  }, [query, enquiries]);

  const getEnquiryLabel = (enquiry: Enquiry) =>
    enquiry.source || enquiry.referredBy || enquiry.status;

  const handleSuggestionClick = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
    setOpen(false);
    setQuery("");
  };

  const handleAddNewEnquiry = () => {
    setIsAddEnquiryOpen(true);
    // setOpen(false);
    // setQuery("");
  };

  const onSubmit = (data: EnquiryFormData) => {
    // Add your API call here to create the enquiry
    mutate(data);
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
          statusColors[status?.toLowerCase()] ||
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
              placeholder="Search enquiries or members..."
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
                <div className="max-h-72 overflow-y-auto">
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
                          enquiry.phone ?? enquiry.fullName ?? index
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
                                {`${enquiry.fullName} (${enquiry.phone})` ||
                                  "Untitled enquiry"}
                              </span>
                              {enquiry.phone ? (
                                <span className="text-xs text-muted-sforeground">
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
                    <div className="w-full px-6 py-4 text-center z-50">
                      <div className="flex flex-col items-center gap-4">
                        {/* Icon with gradient background */}
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)]"></div>
                          <div className="relative rounded-full p-4 bg-gradient-to-br from-[var(--neon-green)]/10 to-[var(--neon-blue)]/10">
                            <SearchX
                              className="w-8 h-8"
                              style={{ color: "var(--neon-green)" }}
                            />
                          </div>
                        </div>

                        {/* Text content */}
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-foreground">
                            No enquiries found
                          </h3>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            We couldn't find any matching enquiries. Would you
                            like to create a new one?
                          </p>
                        </div>

                        {/* CTA Button */}
                        <Button
                          type="button"
                          onClick={() => handleAddNewEnquiry()}
                          className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] text-white hover:shadow-xl"
                          style={{
                            boxShadow:
                              "0 10px 25px -5px color-mix(in srgb, var(--neon-green) 25%, transparent)",
                          }}
                        >
                          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                          <span>Add New Enquiry</span>
                        </Button>

                        {/* Optional: Subtle hint text */}
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          Or try adjusting your search terms
                        </p>
                      </div>
                    </div>
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
              {selectedEnquiry?.isEnquiry ? "Enquiry" : "Member"} Details
            </DialogTitle>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{selectedEnquiry.fullName}</p>
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
            {!selectedEnquiry?.isEnquiry ? (
              <Button
                // variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  router.push(`/members/${selectedEnquiry?._id as string}`);
                }}
              >
                View Profile
              </Button>
            ) : (
              <Button
                type="button"
                // variant="outline"
                onClick={() =>
                  convertMutate({ id: selectedEnquiry?._id as string })
                }
                className="w-full sm:w-auto"
              >
                {convertLoading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  "Convert to Member"
                )}
              </Button>
            )}
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
              <EnquiryForm isEditing={false} />
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddEnquiryOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto bg-gradient-to-r from-neon-green to-neon-blue text-white"
                >
                  {isPending ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Add Enquiry"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </header>
  );
}
