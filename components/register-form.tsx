"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dumbbell,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader,
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

function Registration() {
  const router = useRouter();
  const { register: handleRegister, authLoading: isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      gymName: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const referralCode = form.watch("referralCode");

  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
  };

  const onSubmit = async (data: RegistrationFormData) => {
    handleRegister(data);
  };

  return (
    <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12">
      <div className="w-full max-w-md">
        {/* Logo and Brand - Always visible */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl shadow-lg">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-foreground">FitnessPro</h1>
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
                  name="gymName"
                  placeholder="FitPro Fitness Center"
                  label="Gym Name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <CustomField
                  label="Email Address"
                  name="email"
                  placeholder="owner@example.com"
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
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
                className="w-full h-11"
                disabled={isLoading}
                onClick={() => router.back()}
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
