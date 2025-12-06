"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { ModeToggle } from "./ui/mode-toggler";
import { CommonContoller } from "@/lib/controller/httpApis";
import { useDebounce } from "@/hooks/use-debounce";
import { EnquiriesResponse, Enquiry } from "@/types/types";

export function SiteHeader({ name }: { name?: string }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 300);

  const commonController = new CommonContoller();
  const { data, isLoading } = useQuery<EnquiriesResponse>({
    queryKey: ["search-enquiries", debouncedQuery],
    queryFn: () => commonController.searchEnquiries(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const enquiries = data?.enquiries ?? [];
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setOpen(false);
    }
  }, [query]);

  const getEnquiryLabel = (enquiry: Enquiry) =>
    enquiry.name ||
    enquiry.phone ||
    enquiry.source ||
    enquiry.referredBy ||
    enquiry.status;

  const handleSuggestionClick = (enquiry: Enquiry) => {
    const label = getEnquiryLabel(enquiry);
    setQuery(label ?? "");
    setOpen(false);
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
                  ) : enquiries.length > 0 ? (
                    <ul className="divide-y divide-border">
                      {enquiries.map((enquiry, index) => {
                        const label = getEnquiryLabel(enquiry);
                        const meta = [enquiry.source, enquiry.status, enquiry.referredBy]
                          .filter(Boolean)
                          .join(" | ");
                        const key = `${enquiry.phone ?? enquiry.name ?? index}-${index}`;
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
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No enquiries found
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
    </header>
  );
}
