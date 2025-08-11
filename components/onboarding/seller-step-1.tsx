"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Briefcase,
  Calendar,
  Building,
  Globe,
  AlertCircle,
} from "lucide-react";

interface SellerStep1Props {
  onNext: (data: any) => void;
  isSaving: boolean;
}

export default function SellerStep1({ onNext, isSaving }: SellerStep1Props) {
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    experienceYears: "",
    organization: "",
    website: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.profession.trim()) {
      newErrors.profession = "Profession is required";
    }

    if (!formData.experienceYears) {
      newErrors.experienceYears = "Years of experience is required";
    } else {
      const years = parseInt(formData.experienceYears);
      if (isNaN(years) || years < 0) {
        newErrors.experienceYears = "Please enter a valid number of years";
      }
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    onNext({
      step: 1,
      name: formData.name.trim(),
      profession: formData.profession.trim(),
      experienceYears: parseInt(formData.experienceYears),
      organization: formData.organization.trim() || undefined,
      website: formData.website.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Tell Us About Yourself</h3>
        <p className="text-muted-foreground">
          Help us understand your background and expertise. This information
          will be visible to potential buyers.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Full Name *</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="profession" className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span>Profession / Industry *</span>
          </Label>
          <Input
            id="profession"
            value={formData.profession}
            onChange={(e) => handleInputChange("profession", e.target.value)}
            placeholder="e.g., Software Developer, Marketing Manager, Data Analyst"
            className={errors.profession ? "border-red-500" : ""}
          />
          {errors.profession && (
            <p className="text-sm text-red-500 mt-1">{errors.profession}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="experienceYears"
            className="flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Years of Experience *</span>
          </Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            value={formData.experienceYears}
            onChange={(e) =>
              handleInputChange("experienceYears", e.target.value)
            }
            placeholder="0"
            className={errors.experienceYears ? "border-red-500" : ""}
          />
          {errors.experienceYears && (
            <p className="text-sm text-red-500 mt-1">
              {errors.experienceYears}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="organization" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Organization (Optional)</span>
          </Label>
          <Input
            id="organization"
            value={formData.organization}
            onChange={(e) => handleInputChange("organization", e.target.value)}
            placeholder="Company or organization name"
          />
        </div>

        <div>
          <Label htmlFor="website" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Website / Portfolio (Optional)</span>
          </Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            placeholder="https://your-website.com"
            className={errors.website ? "border-red-500" : ""}
          />
          {errors.website && (
            <p className="text-sm text-red-500 mt-1">{errors.website}</p>
          )}
        </div>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">
                Why we need this information
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This information helps build trust with potential buyers and
                showcases your expertise. It will be displayed on your seller
                profile and workflow listings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
