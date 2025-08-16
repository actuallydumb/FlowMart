"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Briefcase,
  Code,
  Palette,
  BarChart3,
  FileText,
  Zap,
  Globe,
  Database,
  Shield,
} from "lucide-react";

interface BuyerStep1Props {
  onNext: (data: any) => void;
  isSaving: boolean;
}

const interestCategories = [
  {
    id: "automation",
    name: "Automation",
    icon: Zap,
    description: "Workflow automation tools",
  },
  {
    id: "productivity",
    name: "Productivity",
    icon: Briefcase,
    description: "Productivity and task management",
  },
  {
    id: "development",
    name: "Development",
    icon: Code,
    description: "Software development workflows",
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    description: "Design and creative workflows",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    description: "Data analysis and reporting",
  },
  {
    id: "content",
    name: "Content",
    icon: FileText,
    description: "Content creation and management",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: ShoppingCart,
    description: "Online business workflows",
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: Globe,
    description: "Marketing and growth workflows",
  },
  {
    id: "data",
    name: "Data",
    icon: Database,
    description: "Data processing and management",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    description: "Security and compliance workflows",
  },
];

export default function BuyerStep1({ onNext, isSaving }: BuyerStep1Props) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (selectedInterests.length === 0) {
      return;
    }

    onNext({
      step: getStepNumber("buyer-1"),
      interests: selectedInterests,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What interests you?</h3>
        <p className="text-muted-foreground">
          Select the types of workflows you're most interested in. This helps us
          personalize your experience.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {interestCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedInterests.includes(category.id);

          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => toggleInterest(category.id)}
            >
              <CardContent className="p-4 text-center">
                <Icon
                  className={`h-8 w-8 mx-auto mb-2 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <h4 className="font-medium mb-1">{category.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {category.description}
                </p>
                {isSelected && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-muted-foreground">
          {selectedInterests.length > 0 ? (
            <span>
              {selectedInterests.length} interest
              {selectedInterests.length !== 1 ? "s" : ""} selected
            </span>
          ) : (
            <span>Please select at least one interest</span>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedInterests.length === 0 || isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
function getStepNumber(arg0: string) {
  throw new Error("Function not implemented.");
}
