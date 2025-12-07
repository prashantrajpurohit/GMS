"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Filter,
  Phone,
  Loader,
  Edit,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { addEditData } from "@/reduxstore/editIDataSlice";
import { StoreRootState } from "@/reduxstore/reduxStore";
import NoData from "@/components/reusableComponents/no-data";
import { Skeleton } from "@/components/ui/skeleton";
import EnquiriesController from "./controller";
import { EnquiryFormData, enquirySchema } from "@/lib/validation-schemas";
import EnquiryForm from "@/components/forms/addEditEnquiryForm";
import { enquiryInitialFormValues } from "@/lib/constants";

interface EnquiryInterface extends EnquiryFormData {
  _id: string;
  gymId: string;
  createdAt: string;
  updatedAt: string;
}

// Move initialFormValues inside the component or make it a const within this file
// but NOT exported from a Next.js page


// Status Badge Component
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    new: {
      label: "New",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    contacted: {
      label: "Contacted",
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    interested: {
      label: "Interested",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    not_interested: {
      label: "Not Interested",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    converted: {
      label: "Converted",
      className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

// Skeleton Components
const EnquiryTableSkeleton = () => (
  <Card className="border-border/50">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-48 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden sm:table-cell">Source</TableHead>
              <TableHead className="hidden md:table-cell">
                Referred By
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-28" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-3 w-24" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-3 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-3 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

// View Details Modal Component
const ViewEnquiryModal = ({
  enquiry,
  isOpen,
  onClose,
}: {
  enquiry: EnquiryInterface | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!enquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Enquiry Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-medium">{enquiry.fullName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              {getStatusBadge(enquiry.status)}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <p className="font-medium">{enquiry.phone}</p>
            </div>
          </div>

          {enquiry.source && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Source</p>
              <p className="font-medium">{enquiry.source}</p>
            </div>
          )}

          {enquiry.referredBy && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Referred By</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{enquiry.referredBy}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created At</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">
                  {new Date(enquiry.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Component - DEFAULT EXPORT ONLY
export default function EnquiriesManagement() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const editData = useSelector(
    (state: StoreRootState) => state.data.editData as EnquiryInterface | null
  );

  const enquiryController = new EnquiriesController();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      editData
        ? enquiryController.updateEnquiry({
            id: editData._id,
            payload: data,
          })
        : enquiryController.addEnquiry(data),
    onSuccess: () => {
      setIsAddEnquiryOpen(false);
      queryClient.invalidateQueries({ queryKey: ["enquiries-list"] });
      toast.success(`Enquiry ${editData ? "updated" : "added"} successfully!`);
      form.reset(enquiryInitialFormValues);
      dispatch(addEditData(null));
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
      setIsAddEnquiryOpen(false);
      queryClient.invalidateQueries({ queryKey: ["enquiries-list"] });
      toast.success(`Enquiry ${editData ? "updated" : "added"} successfully!`);
      form.reset(enquiryInitialFormValues);
      dispatch(addEditData(null));
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to save enquiry. Please try again."
      );
    },
  });

  const { data = [], isLoading } = useQuery<[EnquiryInterface] | []>({
    queryKey: ["enquiries-list"],
    queryFn: enquiryController.getAllEnquiries,
  });
  const enquiries = data?.length > 0 ? data : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddEnquiryOpen, setIsAddEnquiryOpen] = useState(false);
  const [viewEnquiry, setViewEnquiry] = useState<EnquiryInterface | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredEnquiries = (enquiries?.length > 0 ? enquiries : [])?.filter(
    (enquiry) => {
      const matchesSearch =
        enquiry?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry?.phone.includes(searchTerm) ||
        enquiry?.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry?.referredBy?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || enquiry.status === selectedFilter;
      return matchesSearch && matchesFilter;
    }
  );

  // Pagination calculations
  const totalPages = Math.ceil((filteredEnquiries?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnquiries = filteredEnquiries?.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  const handleViewDetails = (enquiry: EnquiryInterface) => {
    setViewEnquiry(enquiry);
    setIsViewModalOpen(true);
  };

  const handleEdit = (enquiry: EnquiryInterface) => {
    dispatch(addEditData(enquiry));
    setIsAddEnquiryOpen(true);
  };

  const enquiryCounts = {
    all: enquiries?.length || 0,
    new: enquiries?.filter((e) => e.status === "new")?.length || 0,
    contacted: enquiries?.filter((e) => e.status === "contacted")?.length || 0,
    interested:
      enquiries?.filter((e) => e.status === "interested")?.length || 0,
    not_interested:
      enquiries?.filter((e) => e.status === "not_interested")?.length || 0,
    converted: enquiries?.filter((e) => e.status === "converted")?.length || 0,
  };

  const form = useForm<EnquiryFormData>({
    defaultValues: editData ?? { ...enquiryInitialFormValues },
    values: editData ?? undefined,
    resolver: zodResolver(enquirySchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<EnquiryFormData> = (data) => {
    mutate(data);
  };

  function handleOpen(open: boolean) {
    setIsAddEnquiryOpen(open);
    if (!open) {
      dispatch(addEditData(null));
      form.reset(enquiryInitialFormValues);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Enquiries Management</h1>
          <p className="text-muted-foreground">
            Track and manage gym membership enquiries
          </p>
        </div>

        <Dialog open={isAddEnquiryOpen} onOpenChange={handleOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-neon-green to-neon-blue text-white">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add New Enquiry</span>
              <span className="sm:hidden">Add Enquiry</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editData ? "Edit Enquiry" : "Add New Enquiry"}
              </DialogTitle>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <EnquiryForm isEditing={!!editData} />
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      editData
                        ? convertMutate({ id: editData?._id })
                        : handleOpen(false)
                    }
                    className="w-full sm:w-auto"
                  >
                    {convertLoading ? (
                      <>
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                        Saving...
                      </>
                    ) : editData ? (
                      "Convert to Member"
                    ) : (
                      "Cancel"
                    )}
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
                    ) : editData ? (
                      "Update Enquiry"
                    ) : (
                      "Add Enquiry"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search enquiries by name, phone, or source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ({enquiryCounts.all})</SelectItem>
                  <SelectItem value="new">New ({enquiryCounts.new})</SelectItem>
                  <SelectItem value="contacted">
                    Contacted ({enquiryCounts.contacted})
                  </SelectItem>
                  <SelectItem value="not_interested">
                    Not Interested ({enquiryCounts.not_interested})
                  </SelectItem>
                  <SelectItem value="converted">
                    Converted ({enquiryCounts.converted})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <EnquiryTableSkeleton />
      ) : filteredEnquiries?.length === 0 ? (
        <NoData
          logo={UserPlus}
          title="No enquiries found!"
          {...(searchTerm && {
            subtitle: "Try adjusting your filter or search",
          })}
          {...(searchTerm === "" && {
            actionButton: (
              <Button onClick={() => handleOpen(true)}>
                Add First Enquiry
              </Button>
            ),
          })}
        />
      ) : (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Enquiries ({filteredEnquiries?.length})</CardTitle>
            <CardDescription>
              {selectedFilter === "all"
                ? "All enquiries"
                : `Enquiries with ${selectedFilter.replace("_", " ")} status`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Source
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Referred By
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEnquiries?.map((enquiry) => (
                    <TableRow key={enquiry._id}>
                      <TableCell>
                        <div className="font-medium">{enquiry.fullName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          {enquiry.phone}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {enquiry.source || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {enquiry.referredBy || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(enquiry.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(enquiry)}
                            className="hover:bg-neon-green/10 hover:text-neon-green"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(enquiry)}
                            className="hover:bg-neon-blue/10 hover:text-neon-blue"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {startIndex + 1}-
                  {Math.min(endIndex, filteredEnquiries?.length)} of{" "}
                  {filteredEnquiries?.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Details Modal */}
      <ViewEnquiryModal
        enquiry={viewEnquiry}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewEnquiry(null);
        }}
      />
    </div>
  );
}
