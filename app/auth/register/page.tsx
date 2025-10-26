import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface RegistrationProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export function Registration({ onRegister, onBackToLogin }: RegistrationProps) {
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    gymName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Gym name validation
    if (!gymName.trim()) {
      newErrors.gymName = "Gym name is required";
    } else if (gymName.trim().length < 3) {
      newErrors.gymName = "Gym name must be at least 3 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password = "Password does not meet requirements";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);

      if (referralCode.trim()) {
        toast.success("Registration successful!", {
          description: `Welcome to ${gymName}! Referral code applied.`,
        });
      } else {
        toast.success("Registration successful!", {
          description: `Welcome to ${gymName}!`,
        });
      }

      onRegister();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-neon-green to-neon-blue rounded-xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl text-center text-foreground">
            Gym Management System
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Create Your Gym Account
          </p>
        </div>

        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Register your gym and start managing members today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Gym Name */}
              <div className="space-y-2">
                <Label htmlFor="gymName">Gym Name</Label>
                <Input
                  id="gymName"
                  type="text"
                  placeholder="FitPro Fitness Center"
                  value={gymName}
                  onChange={(e) => {
                    setGymName(e.target.value);
                    setErrors({ ...errors, gymName: undefined });
                  }}
                  className={errors.gymName ? "border-red-500" : ""}
                  required
                />
                {errors.gymName && (
                  <p className="text-xs text-red-500">{errors.gymName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: undefined });
                  }}
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: undefined });
                    }}
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                    required
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
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
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
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    className={
                      errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                    required
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
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              {/* Referral Code (Optional) */}
              <div className="space-y-2">
                <Label
                  htmlFor="referralCode"
                  className="flex items-center gap-2"
                >
                  Referral Code
                  <span className="text-xs text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code if you have one"
                  value={referralCode}
                  onChange={(e) =>
                    setReferralCode(e.target.value.toUpperCase())
                  }
                  className="uppercase"
                />
                {referralCode && referralCode.length > 0 && (
                  <p className="text-xs text-neon-green flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Referral code will be validated during registration
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-green/80 hover:to-neon-blue/80 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Back to Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-neon-green/30 hover:bg-neon-green/10 hover:border-neon-green/50 text-foreground"
                onClick={onBackToLogin}
                disabled={isLoading}
              >
                Already have an account? Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}
