"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gift,
  Copy,
  Check,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Referral {
  id: string;
  friendName: string;
  friendEmail: string;
  friendPhone: string;
  status: "pending" | "joined" | "active" | "expired";
  inviteDate: string;
  joinDate?: string;
  monthsActive: number; // Number of months the friend has been active
  reward: number; // Number of free months earned
  rewardStatus: "pending" | "earned" | "claimed";
}

// Mock data
const mockReferrals: Referral[] = [
  {
    id: "R001",
    friendName: "Arjun Mehta",
    friendEmail: "arjun@example.com",
    friendPhone: "+91 98765 11111",
    status: "active",
    inviteDate: "2025-06-15",
    joinDate: "2025-06-18",
    monthsActive: 4,
    reward: 1,
    rewardStatus: "claimed",
  },
  {
    id: "R002",
    friendName: "Kavya Nair",
    friendEmail: "kavya@example.com",
    friendPhone: "+91 98765 22222",
    status: "active",
    inviteDate: "2025-07-10",
    joinDate: "2025-07-15",
    monthsActive: 3,
    reward: 1,
    rewardStatus: "earned",
  },
  {
    id: "R003",
    friendName: "Rohan Kapoor",
    friendEmail: "rohan@example.com",
    friendPhone: "+91 98765 33333",
    status: "active",
    inviteDate: "2025-09-01",
    joinDate: "2025-09-03",
    monthsActive: 2,
    reward: 0,
    rewardStatus: "pending",
  },
  {
    id: "R004",
    friendName: "Sneha Desai",
    friendEmail: "sneha@example.com",
    friendPhone: "+91 98765 44444",
    status: "pending",
    inviteDate: "2025-10-15",
    monthsActive: 0,
    reward: 0,
    rewardStatus: "pending",
  },
  {
    id: "R005",
    friendName: "Aditya Shah",
    friendEmail: "aditya@example.com",
    friendPhone: "+91 98765 55555",
    status: "expired",
    inviteDate: "2025-08-01",
    monthsActive: 0,
    reward: 0,
    rewardStatus: "pending",
  },
];

const rewardTiers = [
  { referrals: 3, freeMonths: 3, bonus: 0 },
  { referrals: 5, freeMonths: 5, bonus: 1 },
  { referrals: 10, freeMonths: 10, bonus: 3 },
];

 function ReferralProgram() {
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [copied, setCopied] = useState(false);
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };
  const referralCode = "FITPRO-VK2025";

  // Calculate statistics
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((r) => r.status === "active").length;
  const pendingReferrals = referrals.filter(
    (r) => r.status === "pending"
  ).length;
  const totalEarned = referrals
    .filter((r) => r.rewardStatus === "claimed")
    .reduce((sum, r) => sum + r.reward, 0);
  const pendingRewards = referrals
    .filter((r) => r.rewardStatus === "earned")
    .reduce((sum, r) => sum + r.reward, 0);

  // Calculate next tier progress
  const currentTierIndex = rewardTiers.findIndex(
    (tier) => activeReferrals < tier.referrals
  );
  const nextTier =
    currentTierIndex !== -1 ? rewardTiers[currentTierIndex] : null;
  const progressToNextTier = nextTier
    ? (activeReferrals / nextTier.referrals) * 100
    : 100;

  const handleCopy = () => {
    // Fallback method for copying text that works in all environments
    const textArea = document.createElement("textarea");
    textArea.value = referralCode;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        toast.success("Referral code copied!", {
          description: "Share it with your friends to earn rewards",
        });
        setTimeout(() => setCopied(false), 2000);
      } else {
        // If execCommand fails, try the modern API as fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(referralCode)
            .then(() => {
              setCopied(true);
              toast.success("Referral code copied!", {
                description: "Share it with your friends to earn rewards",
              });
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
              toast.error("Failed to copy code", {
                description: "Please copy the code manually",
              });
            });
        } else {
          toast.error("Failed to copy code", {
            description: "Please copy the code manually",
          });
        }
      }
    } catch (err) {
      // If all methods fail, show error
      toast.error("Failed to copy code", {
        description: "Please copy the code manually",
      });
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleClaimReward = (referralId: string) => {
    toast.success("Reward claimed!", {
      description: "1 free month has been added to your membership",
    });
  };

  const formatMonths = (months: number) => {
    return months === 1 ? "1 Free Month" : `${months} Free Months`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "joined":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "expired":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-4 h-4" />;
      case "joined":
        return <Users className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "expired":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl">Referral Program</h1>
        <p className="text-muted-foreground mt-1">
          Invite friends and earn rewards together
        </p>
      </div>

      {/* Referral Code Card - Featured */}
      <Card className="border-2 border-neon-green/30 bg-gradient-to-br from-neon-green/10 via-neon-blue/5 to-transparent">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-neon-blue">
              <Gift className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl mb-2">Your Referral Code</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Share this code with friends and earn 1 free month when they
                stay active for 3 consecutive months!
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="bg-background border-2 border-neon-green/50 rounded-lg p-6 sm:p-8">
                  <p className="text-3xl sm:text-4xl font-mono tracking-wider text-neon-green font-semibold">
                    {referralCode}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleCopy}
                className="mt-4 w-full sm:w-auto bg-neon-green hover:bg-neon-green/90 text-black gap-2"
                size="lg"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-neon-green/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-neon-green" />
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl">{totalReferrals}</p>
              <p className="text-xs text-muted-foreground">
                {activeReferrals} active members
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Pending Invites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl">{pendingReferrals}</p>
              <p className="text-xs text-muted-foreground">Waiting to join</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neon-blue/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neon-blue" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl">{formatMonths(totalEarned)}</p>
              <p className="text-xs text-muted-foreground">Already claimed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              Pending Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl">{formatMonths(pendingRewards)}</p>
              <p className="text-xs text-muted-foreground">Ready to claim</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Tiers */}
      {nextTier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Unlock Bonus Rewards
            </CardTitle>
            <CardDescription>
              Reach milestones to earn bonus rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {activeReferrals} of {nextTier.referrals} active referrals
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progressToNextTier)}%
                </span>
              </div>
              <Progress value={progressToNextTier} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {nextTier.referrals - activeReferrals} more active referral
                {nextTier.referrals - activeReferrals !== 1 ? "s" : ""} to
                unlock{" "}
                {nextTier.bonus > 0
                  ? formatMonths(nextTier.bonus)
                  : "0 Free Months"}{" "}
                bonus!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rewardTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    activeReferrals >= tier.referrals
                      ? "border-neon-green bg-neon-green/5"
                      : "border-border bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Tier {index + 1}
                      </p>
                      <p className="font-semibold">
                        {tier.referrals} Referrals
                      </p>
                    </div>
                    {activeReferrals >= tier.referrals && (
                      <CheckCircle2 className="w-5 h-5 text-neon-green" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Earn: {formatMonths(tier.freeMonths)}
                  </p>
                  {tier.bonus > 0 && (
                    <p className="text-sm font-medium text-neon-green">
                      Bonus: {formatMonths(tier.bonus)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referrals Table/List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>
            Track the status of your referred friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({totalReferrals})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeReferrals})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingReferrals})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Friend</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invite Date</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No referrals yet. Start sharing your code!
                        </TableCell>
                      </TableRow>
                    ) : (
                      referrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                                  {referral.friendName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {referral.friendName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {referral.friendEmail}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`gap-1 ${getStatusColor(
                                referral.status
                              )}`}
                            >
                              {getStatusIcon(referral.status)}
                              {referral.status.charAt(0).toUpperCase() +
                                referral.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(referral.inviteDate)}
                          </TableCell>
                          <TableCell>
                            {referral.joinDate
                              ? formatDate(referral.joinDate)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {referral.reward > 0 ? (
                              <div>
                                <p className="font-medium">
                                  {formatMonths(referral.reward)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {referral.monthsActive}/3 months
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-muted-foreground">-</p>
                                <p className="text-xs text-muted-foreground">
                                  {referral.monthsActive}/3 months
                                </p>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {referral.rewardStatus === "earned" && (
                              <Button
                                size="sm"
                                className="bg-neon-green hover:bg-neon-green/90 text-black"
                                onClick={() => handleClaimReward(referral.id)}
                              >
                                Claim Reward
                              </Button>
                            )}
                            {referral.rewardStatus === "claimed" && (
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-500 border-green-500/20"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Claimed
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {referrals.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No referrals yet. Start sharing your code!
                    </CardContent>
                  </Card>
                ) : (
                  referrals.map((referral) => (
                    <Card key={referral.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                              {referral.friendName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{referral.friendName}</p>
                            <p className="text-sm text-muted-foreground">
                              {referral.friendEmail}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`gap-1 ${getStatusColor(
                              referral.status
                            )}`}
                          >
                            {getStatusIcon(referral.status)}
                            {referral.status.charAt(0).toUpperCase() +
                              referral.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Invited</p>
                            <p>{formatDate(referral.inviteDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Joined</p>
                            <p>
                              {referral.joinDate
                                ? formatDate(referral.joinDate)
                                : "-"}
                            </p>
                          </div>
                        </div>

                        {referral.reward > 0 && (
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Reward
                              </p>
                              <p className="font-medium">
                                {formatMonths(referral.reward)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {referral.monthsActive}/3 months
                              </p>
                            </div>
                            {referral.rewardStatus === "earned" && (
                              <Button
                                size="sm"
                                className="bg-neon-green hover:bg-neon-green/90 text-black"
                                onClick={() => handleClaimReward(referral.id)}
                              >
                                Claim
                              </Button>
                            )}
                            {referral.rewardStatus === "claimed" && (
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-500 border-green-500/20"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Claimed
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Friend</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invite Date</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.filter((r) => r.status === "active").length ===
                    0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No active referrals yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      referrals
                        .filter((r) => r.status === "active")
                        .map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                                    {referral.friendName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {referral.friendName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {referral.friendEmail}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`gap-1 ${getStatusColor(
                                  referral.status
                                )}`}
                              >
                                {getStatusIcon(referral.status)}
                                {referral.status.charAt(0).toUpperCase() +
                                  referral.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDate(referral.inviteDate)}
                            </TableCell>
                            <TableCell>
                              {referral.joinDate
                                ? formatDate(referral.joinDate)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {referral.reward > 0 ? (
                                <div>
                                  <p className="font-medium">
                                    {formatMonths(referral.reward)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {referral.monthsActive}/3 months
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-muted-foreground">-</p>
                                  <p className="text-xs text-muted-foreground">
                                    {referral.monthsActive}/3 months
                                  </p>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {referral.rewardStatus === "earned" && (
                                <Button
                                  size="sm"
                                  className="bg-neon-green hover:bg-neon-green/90 text-black"
                                  onClick={() => handleClaimReward(referral.id)}
                                >
                                  Claim Reward
                                </Button>
                              )}
                              {referral.rewardStatus === "claimed" && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 text-green-500 border-green-500/20"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Claimed
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {referrals.filter((r) => r.status === "active").length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No active referrals yet
                    </CardContent>
                  </Card>
                ) : (
                  referrals
                    .filter((r) => r.status === "active")
                    .map((referral) => (
                      <Card key={referral.id}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                                {referral.friendName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">
                                {referral.friendName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {referral.friendEmail}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`gap-1 ${getStatusColor(
                                referral.status
                              )}`}
                            >
                              {getStatusIcon(referral.status)}
                              {referral.status.charAt(0).toUpperCase() +
                                referral.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Invited</p>
                              <p>{formatDate(referral.inviteDate)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Joined</p>
                              <p>
                                {referral.joinDate
                                  ? formatDate(referral.joinDate)
                                  : "-"}
                              </p>
                            </div>
                          </div>

                          {referral.reward > 0 && (
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Reward
                                </p>
                                <p className="font-medium">
                                  {formatMonths(referral.reward)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {referral.monthsActive}/3 months
                                </p>
                              </div>
                              {referral.rewardStatus === "earned" && (
                                <Button
                                  size="sm"
                                  className="bg-neon-green hover:bg-neon-green/90 text-black"
                                  onClick={() => handleClaimReward(referral.id)}
                                >
                                  Claim
                                </Button>
                              )}
                              {referral.rewardStatus === "claimed" && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 text-green-500 border-green-500/20"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Claimed
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Friend</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invite Date</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.filter((r) => r.status === "pending").length ===
                    0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No pending referrals
                        </TableCell>
                      </TableRow>
                    ) : (
                      referrals
                        .filter((r) => r.status === "pending")
                        .map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                                    {referral.friendName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {referral.friendName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {referral.friendEmail}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`gap-1 ${getStatusColor(
                                  referral.status
                                )}`}
                              >
                                {getStatusIcon(referral.status)}
                                {referral.status.charAt(0).toUpperCase() +
                                  referral.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDate(referral.inviteDate)}
                            </TableCell>
                            <TableCell>
                              {referral.joinDate
                                ? formatDate(referral.joinDate)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {referral.reward > 0 ? (
                                <div>
                                  <p className="font-medium">
                                    {formatCurrency(referral.reward)}
                                  </p>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {referral.rewardStatus}
                                  </p>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="text-right">-</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {referrals.filter((r) => r.status === "pending").length ===
                0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No pending referrals
                    </CardContent>
                  </Card>
                ) : (
                  referrals
                    .filter((r) => r.status === "pending")
                    .map((referral) => (
                      <Card key={referral.id}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                                {referral.friendName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">
                                {referral.friendName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {referral.friendEmail}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`gap-1 ${getStatusColor(
                                referral.status
                              )}`}
                            >
                              {getStatusIcon(referral.status)}
                              {referral.status.charAt(0).toUpperCase() +
                                referral.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Invited</p>
                              <p>{formatDate(referral.inviteDate)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Joined</p>
                              <p>
                                {referral.joinDate
                                  ? formatDate(referral.joinDate)
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReferralProgram;
