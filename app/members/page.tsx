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
import { FormProvider, useForm } from "react-hook-form";
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

interface extendedMemberInterface
  extends Omit<MemberInterface, "currentPlanId"> {
  _id: string;
  currentPlanId: {
    _id?: string;
    name: string;
  };
  amount?: number;
}
function MembershipManagement() {
  const dispatch = useDispatch();
  const [isEditingMember, setIsEditingMember] =
    useState<extendedMemberInterface | null>(null);
  const queryClient = useQueryClient();
  const editData = useSelector((state: StoreRootState) => state.data.editData);

  const memberController = new MembersController();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      isEditingMember
        ? memberController.updateMember({
            id: isEditingMember._id,
            payload: data,
          })
        : memberController.addMember(data),
    onSuccess: () => {
      setIsAddMemberOpen(false);
      queryClient.invalidateQueries({ queryKey: ["members-list"] });
      toast.success(
        `Member ${isEditingMember ? "updated" : "added"} successfully!`
      );
    },
  });
  const { data } = useQuery({
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
      member?.email.toLowerCase().includes(searchTerm.toLowerCase());
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
    active: members?.filter((m) => m.status === "active").length,
    inactive: members?.filter((m) => m.status === "inactive").length,
    expired: members?.filter((m) => m.status === "expired").length,
  };

  const onSubmit = (data: MemberInterface) => {
    mutate(data);
  };
  function handleOpen(open: boolean) {
    setIsAddMemberOpen(open);
    dispatch(addEditData(null));
  }

  const form = useForm<MemberInterface>({
    values: editData ?? { ...initialFormValues },
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
                  setIsEditingMember(null);
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
                  <AddEditMember isEditingMember={isEditingMember} />

                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 px-1 sm:px-0">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-neon-green to-neon-blue text-white order-2 sm:order-1"
                    >
                      {isPending ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : isEditingMember ? (
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
      {filteredMembers.length == 0 ? (
        <NoData
          logo={User}
          title="No member found !!"
          {...(searchTerm && {
            subtitle: "Try adjusting your filter or search",
          })}
          {...(searchTerm === "" && {
            actionButton: (
              <Button onClick={() => setIsAddMemberOpen(true)}>
                Add first Member
              </Button>
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
                          <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center text-white text-sm">
                            {member.fullName.charAt(0)}
                          </div>
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
                            {member.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {member?.currentPlanId?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ₹{member?.amount ?? 0}
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
