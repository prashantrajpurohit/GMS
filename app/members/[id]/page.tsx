"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Phone,
  MapPin,
  ShieldCheck,
  Clock3,
  NotebookPen,
  Dumbbell,
  Users,
} from "lucide-react";
import MembersController from "../controller";
import { ApiUrl } from "@/api/apiUrls";
import { getStatusBadge } from "@/lib/constants";
import { MemberInterface } from "@/lib/validation-schemas";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/reduxStore";

type BillingEntry = {
  _id?: string;
  gymId?: string;
  memberId?: string;
  planCode?: string;
  amount?: number;
  status?: string;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

type MemberProfile = Omit<MemberInterface, "currentPlanId"> & {
  _id?: string;
  gymId?: string;
  memberCode?: string;
  registrationNo?: string;
  batch?: string;
  paymentHistory?: BillingEntry[];
  invoices?: BillingEntry[];
  currentPlan?: {
    _id?: string;
    gymId?: string;
    code?: string;
    name?: string;
    description?: string;
    unit?: string;
    price?: number;
    duration?: number;
    features?: string[];
    isActive?: boolean;
  };
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

const formatCurrency = (value?: number) =>
  typeof value === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value)
    : "Not set";

const billingStatusClasses: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  overdue: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

const MemberSkeleton = () => (
  <div className="space-y-6">
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-2 w-full rounded" />
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default function MemberProfilePage() {
  const { id } = useParams();
  const membersController = new MembersController();
  const userData = useSelector(
    (state: StoreRootState) => state?.data?.userdata?.user
  );

  const { data: memberProfile, isLoading } = useQuery<MemberProfile>({
    queryKey: ["member-profile", id],
    queryFn: () => membersController.memberProfile(id as string),
  });

  console.log(userData, "userData");
  const whatsappLink = useMemo(() => {
    const digits = memberProfile?.phone?.replace(/\D/g, "");
    const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";

    // Extract original day
    const originalDateObj = new Date(memberProfile?.startDate as string);
    const day = originalDateObj.getDate();

    // Current month & year
    const currMonth = new Date().toLocaleDateString("en-IN", { month: "long" });
    const currYear = new Date().getFullYear();

    // Format: 15/December/2025
    const dueDate = `${day}/${currMonth}/${currYear}`;

    // Whatsapp-safe emojis (direct unicode)
    const wave = "👋";
    const calendar = "📆";
    const pray = "🙏";
    const muscle = "💪";

    const message =
      `Hello ${memberProfile?.fullName} \n` +
      `Your monthly gym fee of ₹${memberProfile?.currentPlan?.price} is due on ${dueDate} \n` +
      `Kindly complete the payment to avoid interruption in your membership \n` +
      `Let us know if you need any help!\n` +
      `— ${userData?.gymName} `;

    const text = encodeURIComponent(message);

    return `${base}?text=${text}`;
  }, [memberProfile?.phone]);

  const planProgress = useMemo(() => {
    if (!memberProfile?.startDate || !memberProfile?.endDate) {
      return { percent: 0, daysLeft: 0 };
    }
    const now = Date.now();
    const start = new Date(memberProfile.startDate).getTime();
    const end = new Date(memberProfile.endDate).getTime();
    const total = Math.max(end - start, 1);
    const elapsed = Math.min(Math.max(now - start, 0), total);
    const percent = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    const daysLeft = Math.max(
      Math.ceil((end - now) / (1000 * 60 * 60 * 24)),
      0
    );
    return { percent, daysLeft };
  }, [memberProfile?.startDate, memberProfile?.endDate]);

  if (isLoading || !memberProfile) return <MemberSkeleton />;

  const initials =
    memberProfile.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GM";

  const billingEntries = memberProfile.paymentHistory || [];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-neon-green/20 bg-gradient-to-r from-neon-green/10 via-background to-neon-blue/10 p-6 sm:p-8">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--neon-green)_0%,_transparent_40%),_radial-gradient(circle_at_bottom,_var(--neon-blue)_0%,_transparent_35%)]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-neon-green/40 shadow-md shadow-neon-green/20">
              {memberProfile.photo && (
                <AvatarImage
                  src={ApiUrl.IMAGE_BASE_URL + memberProfile.photo}
                  alt={memberProfile.fullName}
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-neon-green/30 to-neon-blue/30 text-lg font-semibold text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Member Code: {memberProfile.memberCode || "N/A"}
              </p>
              <h1 className="text-3xl font-semibold flex items-center gap-3">
                {memberProfile.fullName}
                {getStatusBadge(memberProfile.status)}
              </h1>
              <p className="text-sm text-muted-foreground">
                {memberProfile.registrationNo
                  ? `Reg. No: ${memberProfile.registrationNo}`
                  : "Registration pending"}
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neon-green/40 bg-background/70 shadow-md shadow-neon-green/10 transition hover:-translate-y-0.5 hover:border-neon-green hover:bg-neon-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/60"
              title="Open WhatsApp chat"
            >
              <img
                src="/images/wa2.png"
                alt="WhatsApp"
                className="h-7 w-7 object-contain"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-4">
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>
              Contact, personal details and membership status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <Phone className="w-4 h-4 text-neon-green" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{memberProfile.phone || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">
                    Emergency: {memberProfile.emergencyContact || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                <MapPin className="w-4 h-4 text-neon-blue" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {memberProfile.address || "Not provided"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Batch: {memberProfile.batch || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatPill
                icon={<Dumbbell className="w-4 h-4 text-neon-green" />}
                label="Weight"
                value={
                  memberProfile.weight
                    ? `${memberProfile.weight} kg`
                    : "Not set"
                }
              />
              <StatPill
                icon={<Users className="w-4 h-4 text-neon-blue" />}
                label="Height"
                value={
                  memberProfile.height
                    ? `${memberProfile.height} cm`
                    : "Not set"
                }
              />
              <StatPill
                icon={<ShieldCheck className="w-4 h-4 text-neon-green" />}
                label="Gender"
                value={memberProfile.gender}
              />
              <StatPill
                icon={<Clock3 className="w-4 h-4 text-neon-blue" />}
                label="Status"
                value={
                  <div className="flex items-center gap-2">
                    {getStatusBadge(memberProfile.status)}
                  </div>
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>
              Current plan, billing and validity timeline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {memberProfile.currentPlan?.name || "No plan"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {memberProfile.currentPlan?.description || "No description"}
                </p>
              </div>
              <Badge className="bg-neon-green/10 text-neon-green border-neon-green/30">
                {memberProfile.currentPlan?.unit || "months"}
              </Badge>
            </div>
            <div className="rounded-lg border border-border/60 p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Start Date</span>
                <span className="text-muted-foreground">
                  {formatDate(memberProfile.startDate)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>End Date</span>
                <span className="text-muted-foreground">
                  {formatDate(memberProfile.endDate)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Price</span>
                <span className="font-semibold text-neon-blue">
                  {formatCurrency(memberProfile.currentPlan?.price)}
                </span>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Progress toward renewal
                </p>
                <Progress value={planProgress.percent} />
              </div>
            </div>

            {memberProfile.currentPlan?.features?.length ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Included</p>
                <div className="flex flex-wrap gap-2">
                  {memberProfile.currentPlan.features.map((feat) => (
                    <Badge
                      key={feat}
                      variant="outline"
                      className="border-neon-green/30 text-foreground"
                    >
                      {feat}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <Button className="w-full bg-gradient-to-r from-neon-green to-neon-blue text-white">
              Renew / Upgrade
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle>Billing & Dues</CardTitle>
          <CardDescription>
            Upcoming invoices, payment status and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {billingEntries.length ? (
            billingEntries.map((entry, idx) => (
              <div
                key={entry._id ?? idx}
                className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase">
                      {`${entry.planCode || ""} Plan`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Invoice #{entry._id?.slice(-6) || "N/A"}
                    </p>
                  </div>
                  <Badge
                    className={
                      billingStatusClasses[entry.status || ""] ||
                      "bg-slate-500/10 text-slate-300 border-slate-500/20"
                    }
                  >
                    {(entry.status || "pending").toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  <InfoRow
                    label="Amount"
                    value={formatCurrency(entry.amount)}
                  />
                  <InfoRow label="Due Date" value={formatDate(entry.dueDate)} />
                  <InfoRow
                    label="Created"
                    value={formatDate(entry.createdAt)}
                  />
                </div>
                <InfoRow
                  label="Notes"
                  value={entry.notes || "Auto-generated on member creation."}
                  stacked
                />
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
              No billing entries yet. Create a plan invoice to track dues,
              amounts and payment status.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle>Notes & History</CardTitle>
          <CardDescription>Internal notes for this member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
            <NotebookPen className="w-4 h-4 text-neon-green mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                {memberProfile.notes?.length
                  ? memberProfile.notes
                  : "No notes yet. Add training highlights, injuries, preferences, or renewal reminders."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 p-3 bg-muted/30 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  stacked,
}: {
  label: string;
  value: React.ReactNode;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/60 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
