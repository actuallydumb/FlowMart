"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { hasRole } from "@/types";
import {
  Upload,
  DollarSign,
  Eye,
  EyeOff,
  Save,
  Send,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface CreateWorkflowForm {
  name: string;
  description: string;
  price: string;
  prerequisites: string;
  documentation: string;
  tags: string[];
  visibility: "public" | "private" | "draft";
  fileUrl: string;
  mediaUrls: string[];
  videoUrl: string;
}

export default function CreateWorkflowPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSellerVerified, setIsSellerVerified] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateWorkflowForm>({
    name: "",
    description: "",
    price: "",
    prerequisites: "",
    documentation: "",
    tags: [],
    visibility: "draft",
    fileUrl: "",
    mediaUrls: [],
    videoUrl: "",
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    checkSellerStatus();
  }, [session, status, router]);

  const checkSellerStatus = async () => {
    try {
      const response = await fetch("/api/onboarding/status");
      if (response.ok) {
        const data = await response.json();

        if (!data.onboardingCompleted) {
          router.push("/onboarding");
          return;
        }

        if (!data.isSellerVerified) {
          toast.error("You must be an approved seller to create workflows");
          router.push("/dashboard");
          return;
        }

        setIsSellerVerified(true);
      }
    } catch (error) {
      console.error("Error checking seller status:", error);
      toast.error("Failed to verify seller status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateWorkflowForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagInput = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Simulate file upload - in real implementation, this would use UploadThing
    const fileUrl = URL.createObjectURL(files[0]);
    setFormData((prev) => ({ ...prev, fileUrl }));
  };

  const handleMediaUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Simulate media upload
    const mediaUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setFormData((prev) => ({
      ...prev,
      mediaUrls: [...prev.mediaUrls, ...mediaUrls],
    }));
  };

  const removeMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
  };

  const saveAsDraft = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          visibility: "draft",
        }),
      });

      if (response.ok) {
        toast.success("Workflow saved as draft");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save workflow");
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error("Failed to save workflow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const publishWorkflow = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          visibility: "public",
        }),
      });

      if (response.ok) {
        toast.success("Workflow published successfully!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to publish workflow");
      }
    } catch (error) {
      console.error("Error publishing workflow:", error);
      toast.error("Failed to publish workflow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isSellerVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You must be an approved seller to create workflows.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Workflow Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe what this workflow does..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) => handleTagInput(e.target.value)}
                placeholder="automation, productivity, marketing"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                value={formData.prerequisites}
                onChange={(e) =>
                  handleInputChange("prerequisites", e.target.value)
                }
                placeholder="What users need to have set up before using this workflow..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="documentation">Documentation</Label>
              <Textarea
                id="documentation"
                value={formData.documentation}
                onChange={(e) =>
                  handleInputChange("documentation", e.target.value)
                }
                placeholder="Detailed instructions on how to use this workflow..."
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">Video URL (Optional)</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="workflowFile">Workflow File *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <input
                  type="file"
                  id="workflowFile"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".json,.yaml,.yml"
                />
                <label htmlFor="workflowFile">
                  <Button variant="outline" className="cursor-pointer">
                    Choose Workflow File
                  </Button>
                </label>
                {formData.fileUrl && (
                  <p className="text-sm text-green-600 mt-2">✓ File uploaded</p>
                )}
              </div>
            </div>
            <div>
              <Label>Media Files (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="mediaFiles"
                  accept="image/*,video/*"
                />
                <label htmlFor="mediaFiles">
                  <Button variant="outline" className="cursor-pointer">
                    Add Screenshots/Videos
                  </Button>
                </label>
                {formData.mediaUrls.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.mediaUrls.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <span className="text-sm">Media {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedia(index)}
                          className="text-red-500"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Visibility</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={(e) =>
                      handleInputChange("visibility", e.target.value)
                    }
                  />
                  <span>Public - Visible in marketplace</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={(e) =>
                      handleInputChange("visibility", e.target.value)
                    }
                  />
                  <span>Private - Only you can see</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="draft"
                    checked={formData.visibility === "draft"}
                    onChange={(e) =>
                      handleInputChange("visibility", e.target.value)
                    }
                  />
                  <span>Draft - Save for later</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Create New Workflow</h1>
        <p className="text-muted-foreground">
          Share your expertise by creating a workflow that others can use
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Documentation & Setup"}
              {currentStep === 3 && "Files & Media"}
              {currentStep === 4 && "Pricing & Visibility"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}

            <div className="flex justify-between items-center pt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <div className="flex space-x-2">
                {currentStep < totalSteps ? (
                  <Button onClick={nextStep}>Next</Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={saveAsDraft}
                      disabled={isSubmitting}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button onClick={publishWorkflow} disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      Publish Workflow
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
