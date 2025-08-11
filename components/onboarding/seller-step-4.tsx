"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Mail,
  Shield,
  FileText,
  CreditCard,
  Upload,
  AlertCircle,
} from "lucide-react";

interface SellerStep4Props {
  onNext: (data: any) => void;
  onPrevious: () => void;
  isSaving: boolean;
}

const completedSteps = [
  {
    icon: FileText,
    title: "Profile Information",
    description: "Personal and professional details submitted",
  },
  {
    icon: CreditCard,
    title: "Payment Setup",
    description: "Bank account and payment details configured",
  },
  {
    icon: Upload,
    title: "Document Verification",
    description: "Identity and expertise documents uploaded",
  },
];

const nextSteps = [
  {
    icon: Clock,
    title: "Review Process",
    description:
      "Our team will review your application within 2-3 business days",
  },
  {
    icon: Mail,
    title: "Email Notification",
    description: "You'll receive an email once the review is complete",
  },
  {
    icon: Shield,
    title: "Start Selling",
    description: "Once approved, you can start uploading and selling workflows",
  },
];

export default function SellerStep4({
  onNext,
  onPrevious,
  isSaving,
}: SellerStep4Props) {
  const handleComplete = () => {
    onNext({
      step: 4,
      completed: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground">
          Thank you for completing your seller application. We're excited to
          have you join our marketplace!
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 text-center">
            What you've completed:
          </h4>
          <div className="space-y-4">
            {completedSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">{step.title}</h5>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 text-center">What happens next:</h4>
          <div className="space-y-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">{step.title}</h5>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">While you wait...</h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You can still browse the marketplace and purchase workflows.
                Once your seller application is approved, you'll be able to
                start uploading your own workflows.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onPrevious} disabled={isSaving}>
          Previous
        </Button>

        <Button
          onClick={handleComplete}
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? "Completing..." : "Go to Dashboard"}
        </Button>
      </div>
    </div>
  );
}
