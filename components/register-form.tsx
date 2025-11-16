"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dumbbell,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Mail,
  Check,
  Loader2,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegistrationFormData,
  registrationSchema,
} from "@/lib/validation-schemas";
import { useAuth } from "@/hooks/use-auth";
import CustomField from "./reusableComponents/customField";
import { CommonContoller } from "@/lib/controller/httpApis";
import { useMutation } from "@tanstack/react-query";

function Registration() {
  const router = useRouter();
  const commonController = new CommonContoller();
  const { register: handleRegister, authLoading: isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [emailLocked, setEmailLocked] = useState(false);

  // Refs for OTP inputs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: sentMailOTP, isPending: sentOtpLoading } = useMutation({
    mutationFn: commonController.sentOTPonMail,
    onSuccess: () => {
      setOtpSent(true);
      setEmailLocked(true);
      toast.success("OTP sent to your email!");
    },
  });
  const { mutate: verifyMailOTP, isPending: verifyOtpLoading } = useMutation({
    mutationFn: commonController.verifyMailOtp,
    onSuccess: () => {
      setOtpVerified(true);
      toast.success("Email verified successfully!");
    },
  });

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      gymName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const referralCode = form.watch("referralCode");
  const email = form.watch("email");

  // Check if email is valid
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
  };

  // Timer effect for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    }
  };

  // Handle paste event
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      toast.error("Please paste numbers only");
      return;
    }

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      otpRefs.current[nextEmptyIndex]?.focus();
    } else {
      otpRefs.current[5]?.focus();
    }
  };

  // Handle Edit Email
  const handleEditEmail = () => {
    setEmailLocked(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(0);
  };

  // Send OTP function
  const handleSendOtp = async () => {
    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingOtp(true);
    try {
      sentMailOTP({ email: form.watch("email") });
      // Reset OTP fields when sending new OTP
      setOtp(["", "", "", "", "", ""]);
      // Start 2 minute countdown timer
      setResendTimer(120);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP function
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    try {
      verifyMailOTP({ email: form.watch("email"), otp: otpString });
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    if (!otpVerified) {
      toast.error("Please verify your email first");
      return;
    }
    handleRegister(data);
  };

  return (
    <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12">
      <div className="w-full max-w-md">
        {/* Logo and Brand - Always visible */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl shadow-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">GYM FREAKY</h1>
          </div>
          <p className="text-muted-foreground text-center">
            Gym Management System
          </p>
        </div>

        {/* Registration Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl">Get Started</h2>
            <p className="text-muted-foreground">
              Register your gym and start managing members today
            </p>
          </div>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Gym Name */}
              <div className="space-y-2">
                <CustomField
                  isLoading={false}
                  name="gymName"
                  placeholder="FitPro Fitness Center"
                  label="Gym Name"
                />
              </div>

              {/* Email with OTP Verification */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder="owner@example.com"
                      {...form.register("email")}
                      disabled={otpVerified || emailLocked}
                      className={`h-11 ${
                        otpVerified || emailLocked
                          ? "bg-muted cursor-not-allowed"
                          : ""
                      } ${form.formState.errors.email ? "border-red-500" : ""}`}
                    />
                  </div>

                  {/* Show Send OTP button if email is not locked and not verified */}
                  {!emailLocked && !otpVerified && (
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!isEmailValid || sendingOtp}
                      className="h-11 shrink-0"
                    >
                      {sentOtpLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  )}

                  {/* Show Edit button if email is locked but not verified */}
                  {emailLocked && !otpVerified && (
                    <Button
                      type="button"
                      onClick={handleEditEmail}
                      variant="outline"
                      className="h-11 shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Show verified checkmark if verified */}
                  {otpVerified && (
                    <div className="h-11 px-4 flex items-center justify-center bg-green-500/10 border border-green-500 rounded-md">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}

                {/* OTP Input Fields */}
                {otpSent && !otpVerified && (
                  <div className="space-y-3 pt-2">
                    <Label htmlFor="otp-0">Enter OTP</Label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          ref={(el) => {
                            otpRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="w-12 h-12 text-center text-lg font-semibold bg-background border-stone-400 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                          autoComplete="off"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-muted-foreground">
                        OTP sent to {email}
                      </p>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={sendingOtp || resendTimer > 0}
                        className={`${
                          resendTimer > 0
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-neon-blue hover:underline"
                        }`}
                      >
                        {resendTimer > 0
                          ? `Resend in ${Math.floor(resendTimer / 60)}:${(
                              resendTimer % 60
                            )
                              .toString()
                              .padStart(2, "0")}`
                          : "Resend OTP"}
                      </button>
                    </div>
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.join("").length !== 6 || verifyingOtp}
                      className="w-full h-11"
                    >
                      {verifyOtpLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                  </div>
                )}

                {/* Verification Status */}
                {otpVerified && (
                  <div className="flex items-center gap-2 text-xs text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Email verified successfully</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <CustomField
                  isLoading={false}
                  label="Phone"
                  name="phone"
                  placeholder="+1234567890"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...form.register("password")}
                    className={
                      form.formState.errors.password
                        ? "border-red-500 h-11 pr-10"
                        : "h-11 pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}

                {/* Password strength indicators */}
                {password && (
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-muted-foreground">
                      Password must contain:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        {passwordChecks.length ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordChecks.length
                              ? "text-green-500"
                              : "text-muted-foreground"
                          }
                        >
                          8+ characters
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {passwordChecks.uppercase ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordChecks.uppercase
                              ? "text-green-500"
                              : "text-muted-foreground"
                          }
                        >
                          Uppercase
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {passwordChecks.lowercase ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordChecks.lowercase
                              ? "text-green-500"
                              : "text-muted-foreground"
                          }
                        >
                          Lowercase
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {passwordChecks.number ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span
                          className={
                            passwordChecks.number
                              ? "text-green-500"
                              : "text-muted-foreground"
                          }
                        >
                          Number
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    {...form.register("confirmPassword")}
                    className={
                      form.formState.errors.confirmPassword
                        ? "border-red-500 h-11 pr-10"
                        : "h-11 pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
                {confirmPassword &&
                  password === confirmPassword &&
                  !form.formState.errors.confirmPassword && (
                    <div className="flex items-center gap-1 text-xs text-green-500">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Passwords match</span>
                    </div>
                  )}
              </div>

              {/* Referral Code (Optional) */}
              <div className="space-y-2">
                <CustomField
                  isLoading={false}
                  name="referralCode"
                  label="Referral Code (Optional)"
                  placeholder="Enter referral code if you have one"
                />

                {referralCode && referralCode.length > 0 && (
                  <p className="text-xs text-neon-green flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Referral code will be validated during registration
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-green/90 hover:to-neon-blue/90 text-white shadow-lg"
                disabled={isLoading || !otpVerified}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Back to Login */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 hover:cursor-pointer"
                disabled={isLoading}
                onClick={() => router.push("/auth/login")}
              >
                Already have an account? Sign In
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default Registration;
