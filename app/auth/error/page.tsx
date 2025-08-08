"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const getErrorDetails = () => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return {
          title: "Account Already Exists",
          description:
            "An account with this email already exists using a different sign-in method.",
          message:
            "Please sign in with your password instead of using Google OAuth.",
          action: "Sign in with password",
          actionUrl: `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=OAuthAccountNotLinked`,
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You denied the permission request during sign in.",
          message:
            "Please try signing in again and grant the necessary permissions.",
          action: "Try again",
          actionUrl: `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        };
      case "Configuration":
        return {
          title: "Configuration Error",
          description:
            "There is a problem with the authentication configuration.",
          message: "Please contact support if this problem persists.",
          action: "Go to homepage",
          actionUrl: "/",
        };
      case "Verification":
        return {
          title: "Verification Error",
          description:
            "The verification token has expired or has already been used.",
          message:
            "Please try signing in again or request a new verification link.",
          action: "Sign in again",
          actionUrl: `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        };
      default:
        return {
          title: "Authentication Error",
          description: "An error occurred during the authentication process.",
          message:
            "Please try signing in again or contact support if the problem persists.",
          action: "Try again",
          actionUrl: `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">WorkflowHub</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">{errorDetails.title}</CardTitle>
          <CardDescription>{errorDetails.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">{errorDetails.message}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href={errorDetails.actionUrl}>{errorDetails.action}</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Homepage
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/support" className="text-primary hover:underline">
              Contact Support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
