"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ShoppingCart,
  Search,
  Heart,
  Star,
  Zap,
} from "lucide-react";

interface BuyerStep3Props {
  onNext: (data: any) => void;
  onPrevious: () => void;
  isSaving: boolean;
}

const features = [
  {
    icon: Search,
    title: "Discover Workflows",
    description: "Browse thousands of workflows created by experts",
  },
  {
    icon: ShoppingCart,
    title: "Easy Purchases",
    description: "One-click purchases with secure payment processing",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Save workflows you love for later use",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Share your experience and help others",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Download and use workflows immediately",
  },
];

export default function BuyerStep3({
  onNext,
  onPrevious,
  isSaving,
}: BuyerStep3Props) {
  const handleComplete = () => {
    onNext({
      step: 3,
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
        <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
        <p className="text-muted-foreground">
          Welcome to WorkflowKart! You're ready to discover amazing workflows
          that will boost your productivity.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 text-center">
            What you can do now:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">{feature.title}</h5>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">Pro Tip</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Start by exploring the marketplace and saving workflows that catch
              your eye. You can always come back to them later from your
              dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onPrevious} disabled={isSaving}>
          Previous
        </Button>

        <Button
          onClick={handleComplete}
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? "Completing..." : "Get Started"}
        </Button>
      </div>
    </div>
  );
}
