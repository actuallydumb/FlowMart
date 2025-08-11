"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { hasRole } from "@/types";

// Import step components
import BuyerStep1 from "@/components/onboarding/buyer-step-1";
import BuyerStep2 from "@/components/onboarding/buyer-step-2";
import BuyerStep3 from "@/components/onboarding/buyer-step-3";
import SellerStep1 from "@/components/onboarding/seller-step-1";
import SellerStep2 from "@/components/onboarding/seller-step-2";
import SellerStep3 from "@/components/onboarding/seller-step-3";
import SellerStep4 from "@/components/onboarding/seller-step-4";

interface OnboardingStatus {
  onboardingCompleted: boolean;
  onboardingStep: number;
  roles: string[];
  sellerVerificationStatus: string;
  isSellerVerified: boolean;
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    fetchOnboardingStatus();
  }, [session, status, router]);

  const fetchOnboardingStatus = async () => {
    try {
      const response = await fetch("/api/onboarding/status");
      if (response.ok) {
        const data = await response.json();
        setOnboardingStatus(data);
        setCurrentStep(data.onboardingStep);

        // If onboarding is completed, redirect to dashboard
        if (data.onboardingCompleted) {
          router.push("/dashboard");
          return;
        }
      } else {
        toast.error("Failed to fetch onboarding status");
      }
    } catch (error) {
      console.error("Error fetching onboarding status:", error);
      toast.error("Failed to fetch onboarding status");
    } finally {
      setIsLoading(false);
    }
  };

  const saveStep = async (stepData: any) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/onboarding/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stepData),
      });

      if (response.ok) {
        const data = await response.json();
        setOnboardingStatus(data.user);

        // If onboarding is completed, redirect to dashboard
        if (data.user.onboardingCompleted) {
          toast.success("Onboarding completed successfully!");
          router.push("/dashboard");
          return;
        }

        // Move to next step
        setCurrentStep(currentStep + 1);
        toast.success("Step saved successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save step");
      }
    } catch (error) {
      console.error("Error saving step:", error);
      toast.error("Failed to save step");
    } finally {
      setIsSaving(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!onboardingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p className="text-muted-foreground">
                Failed to load onboarding status. Please refresh the page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isBuyer = hasRole(onboardingStatus.roles as any, "BUYER");
  const isSeller = hasRole(onboardingStatus.roles as any, "DEVELOPER");

  const totalSteps = isBuyer ? 3 : 4;
  const progress = (currentStep / totalSteps) * 100;

  const renderStep = () => {
    if (isBuyer) {
      switch (currentStep) {
        case 1:
          return <BuyerStep1 onNext={saveStep} isSaving={isSaving} />;
        case 2:
          return (
            <BuyerStep2
              onNext={saveStep}
              onPrevious={goToPreviousStep}
              isSaving={isSaving}
            />
          );
        case 3:
          return (
            <BuyerStep3
              onNext={saveStep}
              onPrevious={goToPreviousStep}
              isSaving={isSaving}
            />
          );
        default:
          return <BuyerStep1 onNext={saveStep} isSaving={isSaving} />;
      }
    } else if (isSeller) {
      switch (currentStep) {
        case 1:
          return <SellerStep1 onNext={saveStep} isSaving={isSaving} />;
        case 2:
          return (
            <SellerStep2
              onNext={saveStep}
              onPrevious={goToPreviousStep}
              isSaving={isSaving}
            />
          );
        case 3:
          return (
            <SellerStep3
              onNext={saveStep}
              onPrevious={goToPreviousStep}
              isSaving={isSaving}
            />
          );
        case 4:
          return (
            <SellerStep4
              onNext={saveStep}
              onPrevious={goToPreviousStep}
              isSaving={isSaving}
            />
          );
        default:
          return <SellerStep1 onNext={saveStep} isSaving={isSaving} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Badge
              variant={isBuyer ? "default" : "secondary"}
              className="text-sm"
            >
              {isBuyer ? "Buyer" : "Seller"} Onboarding
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isBuyer ? "Welcome to WorkflowKart!" : "Become a Seller"}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {isBuyer
              ? "Let's get you set up to discover amazing workflows"
              : "Complete your seller profile to start uploading workflows"}
          </p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>{renderStep()}</CardContent>
      </Card>
    </div>
  );
}
