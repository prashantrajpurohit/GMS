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
  Mail,
  Loader,
  Edit,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberInterface, memberSchema } from "@/lib/validation-schemas";
import MembersController from "./controller";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImportMembersDialog } from "@/components/ImportMembersDialog";
import AddEditMember from "@/components/forms/addEditMember";
import { getStatusBadge, initialFormValues } from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { addEditData } from "@/reduxstore/editIDataSlice";
import { StoreRootState } from "@/reduxstore/reduxStore";
import NoData from "@/components/reusableComponents/no-data";
import { ApiUrl } from "@/api/apiUrls";
import { Skeleton } from "@/components/ui/skeleton";

interface extendedMemberInterface
  extends Omit<MemberInterface, "currentPlanId"> {
  _id: string;
  currentPlanId: {
    _id?: string;
    name: string;
    price: number;
  };
  amount?: number;
}

// Skeleton Components
const MemberTableSkeleton = () => (
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
              <TableHead>Member</TableHead>
              <TableHead className="hidden sm:table-cell">Contact</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="hidden md:table-cell">Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40 sm:hidden" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-3 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
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

function MembershipManagement() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const editData = useSelector(
    (state: StoreRootState) => state.data.editData as Record<string, any> | null
  );

  const memberController = new MembersController();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      editData
        ? memberController.updateMember({
            id: editData?._id,
            payload: data,
          })
        : memberController.addMember(data),
    onSuccess: () => {
      setIsAddMemberOpen(false);
      queryClient.invalidateQueries({ queryKey: ["members-list"] });
      toast.success(`Member ${editData ? "updated" : "added"} successfully!`);
    },
  });
  const { data, isLoading } = useQuery({
    queryKey: ["members-list"],
    queryFn: memberController.getAllMembers,
  });

  const [members, setMembers] = useState<extendedMemberInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const filteredMembers = members?.filter((member) => {
    const matchesSearch =
      member?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member?.email as string)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member?.phone.includes(searchTerm);
    const matchesFilter =
      selectedFilter === "all" || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleViewProfile = (member: extendedMemberInterface) => {
    dispatch(addEditData(member));
    setIsAddMemberOpen(true);
  };

  const handleImportComplete = (importedMembers: any[]) => {
    setMembers([
      ...members,
      ...importedMembers?.map((m, index) => ({
        ...m,
        id: (members?.length + index + 1).toString(),
      })),
    ]);
    toast.success("Members imported successfully!");
  };

  const memberCounts = {
    all: members?.length,
    active: members?.filter((m) => m.status === "active")?.length,
    inactive: members?.filter((m) => m.status === "inactive")?.length,
    expired: members?.filter((m) => m.status === "expired")?.length,
  };

  const onSubmit: SubmitHandler<MemberInterface> = (data) => {
    mutate(data);
  };

  function handleOpen(open: boolean) {
    setIsAddMemberOpen(open);
    dispatch(addEditData(null));
  }

  const editDataValues = {
    fullName: editData?.fullName,
    email: editData?.email,
    phone: editData?.phone,
    weight: +(editData?.weight ?? 0),
    height: +(editData?.height ?? 0),
    currentPlanId: editData?.currentPlanId?._id,
    startDate: editData?.startDate?.split("T")[0],
    photo: editData?.photo || "",
    dateOfBirth: editData?.dateOfBirth?.split("T")[0],
    gender: editData?.gender,
    address: editData?.address,
    emergencyContact: editData?.emergencyContact || "",
    status: editData?.status,
    notes: editData?.notes || "",
    batch: editData?.batch || "",
  };

  const form = useForm<MemberInterface>({
    values: editDataValues ?? { ...initialFormValues },
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    setMembers(data);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Membership Management</h1>
          <p className="text-muted-foreground">
            Manage gym members, plans, and renewals
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <ImportMembersDialog onImportComplete={handleImportComplete} />

          <Dialog open={isAddMemberOpen} onOpenChange={handleOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  form.reset({ ...initialFormValues });
                  dispatch(addEditData(null));
                }}
                className="bg-gradient-to-r from-neon-green to-neon-blue text-white flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add New Member</span>
                <span className="sm:hidden">Add Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AddEditMember isEditingMember={editData} />

                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 px-1 sm:px-0">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-neon-green to-neon-blue text-white order-2 sm:order-1"
                    >
                      {isPending ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : editData ? (
                        "Update Member"
                      ) : (
                        "Add Member"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </FormProvider>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search members by name or email..."
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
                  <SelectItem value="all">
                    All Members ({memberCounts.all})
                  </SelectItem>
                  <SelectItem value="active">
                    Active ({memberCounts.active})
                  </SelectItem>
                  <SelectItem value="expired">
                    Expired ({memberCounts.expired})
                  </SelectItem>
                  <SelectItem value="inactive">
                    InActive ({memberCounts.inactive})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <MemberTableSkeleton />
      ) : filteredMembers?.length === 0 ? (
        <NoData
          logo={User}
          title="No member found !!"
          {...(searchTerm && {
            subtitle: "Try adjusting your filter or search",
          })}
          {...(searchTerm === "" && {
            actionButton: (
              <Button onClick={() => handleOpen(true)}>Add first Member</Button>
            ),
          })}
        />
      ) : (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Members ({filteredMembers?.length})</CardTitle>
            <CardDescription>
              {selectedFilter === "all"
                ? "All registered members"
                : `Members with ${selectedFilter} status`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Contact
                    </TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Period
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers?.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {member?.photo ? (
                            <div className="w-10 h-10">
                              <img
                                src={ApiUrl.IMAGE_BASE_URL + member?.photo}
                                alt={member?.fullName}
                                className="w-full h-full object-cover rounded-full border-2 border-muted"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center text-white text-sm">
                              {member.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{member.fullName}</div>
                            <div className="text-sm text-muted-foreground sm:hidden">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            {member.email || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {member.phone || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {member?.currentPlanId?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ₹{member?.currentPlanId?.price ?? 0}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="text-sm">
                            {new Date(member.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProfile(member)}
                            className="hover:bg-neon-green/10 hover:text-neon-green"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MembershipManagement;
