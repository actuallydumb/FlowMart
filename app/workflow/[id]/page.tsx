"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Star,
  Calendar,
  User,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  Settings,
} from "lucide-react";
import { WorkflowWithUser, WorkflowReview } from "@/types";
import { ReviewForm } from "@/components/review-form";
import { ReviewsList } from "@/components/reviews-list";
import { MediaGallery } from "@/components/media-gallery";
import { toast } from "sonner";

export default function WorkflowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session } = useSession();
  const [workflow, setWorkflow] = useState<WorkflowWithUser | null>(null);
  const [userReview, setUserReview] = useState<WorkflowReview | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkflow();
    checkPurchaseStatus();
    fetchUserReview();
  }, [params.id, session?.user?.id]);

  const fetchWorkflow = async () => {
    try {
      const response = await fetch(`/api/workflows/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setWorkflow(data);
      } else {
        toast.error("Failed to fetch workflow");
      }
    } catch (error) {
      console.error("Error fetching workflow:", error);
      toast.error("Failed to fetch workflow");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPurchaseStatus = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/purchases/check/${params.id}`);
      if (response.ok) {
        const { hasPurchased } = await response.json();
        setHasPurchased(hasPurchased);
      }
    } catch (error) {
      console.error("Error checking purchase status:", error);
    }
  };

  const fetchUserReview = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/workflows/${params.id}/reviews`);
      if (response.ok) {
        const { reviews } = await response.json();
        const userReview = reviews.find(
          (review: WorkflowReview) => review.user.id === session.user.id
        );
        setUserReview(userReview || null);
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  };

  const handlePurchase = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to purchase workflows");
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflowId: params.id }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to initiate purchase");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to initiate purchase");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/workflows/${params.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${workflow?.name || "workflow"}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Download started!");
      } else {
        toast.error("Failed to download workflow");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download workflow");
    }
  };

  const handleReviewSubmitted = (review: WorkflowReview) => {
    setUserReview(review);
    fetchWorkflow(); // Refresh workflow to update average rating
  };

  const handleReviewUpdated = (review: WorkflowReview) => {
    setUserReview(review);
    fetchWorkflow(); // Refresh workflow to update average rating
  };

  const handleReviewDeleted = () => {
    setUserReview(null);
    fetchWorkflow(); // Refresh workflow to update average rating
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading workflow...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Workflow Not Found</h1>
          <p className="text-muted-foreground">
            The workflow you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id === workflow.user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {workflow.status === "APPROVED" && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {workflow.status === "PENDING" && (
                <Clock className="h-5 w-5 text-yellow-500" />
              )}
              {workflow.status === "REJECTED" && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <Badge
                variant={
                  workflow.status === "APPROVED" ? "default" : "secondary"
                }
              >
                {workflow.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{workflow.name}</h1>
            <p className="text-muted-foreground text-lg">
              {workflow.description}
            </p>

            {/* Rating Display */}
            {workflow.averageRating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(workflow.averageRating!)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {workflow.averageRating.toFixed(1)}
                </span>
                {workflow.reviewCount && (
                  <span className="text-sm text-muted-foreground">
                    ({workflow.reviewCount} review
                    {workflow.reviewCount > 1 ? "s" : ""})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Media Gallery */}
          {(workflow.mediaUrls?.length > 0 || workflow.videoUrl) && (
            <MediaGallery
              images={workflow.mediaUrls || []}
              videoUrl={workflow.videoUrl}
            />
          )}

          {/* Prerequisites */}
          {workflow.prerequisites && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">
                    {workflow.prerequisites}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documentation */}
          {workflow.documentation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">
                    {workflow.documentation}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {workflow.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Creator Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={workflow.user.image || ""} />
                  <AvatarFallback>
                    {workflow.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{workflow.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Workflow Creator
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Downloads
                  </span>
                </div>
                <p className="text-2xl font-bold">{workflow.downloads}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Created</span>
                </div>
                <p className="text-2xl font-bold">
                  {new Date(workflow.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            {/* Review Form */}
            {hasPurchased && !isOwner && (
              <ReviewForm
                workflowId={params.id}
                existingReview={userReview}
                onReviewSubmitted={handleReviewSubmitted}
                onReviewUpdated={handleReviewUpdated}
                onReviewDeleted={handleReviewDeleted}
              />
            )}

            {/* Reviews List */}
            <ReviewsList
              reviews={workflow.reviews || []}
              averageRating={workflow.averageRating}
              reviewCount={workflow.reviewCount}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">${workflow.price}</CardTitle>
              <CardDescription>
                One-time purchase • Lifetime access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isOwner ? (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              ) : hasPurchased ? (
                <Button className="w-full" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? "Processing..." : "Purchase Now"}
                </Button>
              )}

              <div className="text-center text-sm text-muted-foreground">
                30-day money-back guarantee
              </div>
            </CardContent>
          </Card>

          {/* Creator Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={workflow.user.image || ""} />
                  <AvatarFallback>
                    {workflow.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{workflow.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Verified Creator
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
