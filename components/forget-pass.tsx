import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, Shield, User, Lock } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CommonContoller } from "@/lib/controller/httpApis";
type ResetStep = "request" | "success";
function ForgetPassword({ returnToSignIn }: { returnToSignIn: () => void }) {
  const commonApi = new CommonContoller();
  const [currentStep, setCurrentStep] = useState<ResetStep>("request");
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: commonApi.forgotPassword,
    onSuccess() {
      setCurrentStep("success");
    },
  });

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "request":
        return (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Security Notice:</strong> A new temporary password will
                be sent to your registered email address. Please change it after
                logging in.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Make sure to use the email address you registered with
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!email || isPending}
            >
              <Mail className="w-4 h-4 mr-2" />
              {isPending ? "Sending New Password..." : "Send New Password"}
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Still having trouble?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-xs p-0 h-auto"
                  onClick={() =>
                    toast.info(
                      "Please contact support at support@saviouredutech.com"
                    )
                  }
                >
                  Contact Support
                </Button>
              </p>
            </div>
          </form>
        );

      case "success":
        return (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-green-900">
                Password Sent Successfully!
              </h2>
              <p className="text-muted-foreground">
                A new temporary password has been sent to
              </p>
              <p className="font-medium text-foreground">{email}</p>
            </div>

            <Alert className="bg-amber-50 border-amber-200">
              <Lock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="space-y-1">
                  <p className="font-medium">Demo Mode - Your New Password:</p>

                  <p className="text-xs">
                    In production, this would be sent to your email. Please save
                    this password and change it after logging in.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 p-2 rounded-lg space-y-1">
              <p className="text-sm font-medium">Next Steps:</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Check your email inbox for the new password</li>
                <li>
                  Return to the login page and sign in with your new password
                </li>
                <li>
                  For security, change your password immediately after logging
                  in
                </li>
              </ol>
            </div>

            <Button className="w-full" size="lg" onClick={returnToSignIn}>
              <User className="w-4 h-4 mr-2" />
              Return to Sign In
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Didn't receive the email?{" "}
                <Button
                  variant="link"
                  className="text-xs p-0 h-auto"
                  onClick={() => {
                    setCurrentStep("request");
                    toast.info("Please try again or contact support");
                  }}
                >
                  Try Again
                </Button>
              </p>
            </div>
          </div>
        );
    }
  };

  return <>{renderStepContent()}</>;
}

export default ForgetPassword;
