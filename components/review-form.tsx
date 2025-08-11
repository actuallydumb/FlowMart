"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Edit, X } from "lucide-react";
import { WorkflowReview } from "@/types";
import { toast } from "sonner";

interface ReviewFormProps {
  workflowId: string;
  onReviewSubmitted?: (review: WorkflowReview) => void;
  onReviewUpdated?: (review: WorkflowReview) => void;
  onReviewDeleted?: () => void;
  existingReview?: WorkflowReview | null;
}

export function ReviewForm({
  workflowId,
  onReviewSubmitted,
  onReviewUpdated,
  onReviewDeleted,
  existingReview,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(
    existingReview?.reviewText || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.reviewText || "");
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = existingReview
        ? `/api/workflows/${workflowId}/reviews/${existingReview.id}`
        : `/api/workflows/${workflowId}/reviews`;

      const method = existingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          reviewText: reviewText.trim() || undefined,
        }),
      });

      if (response.ok) {
        const review = await response.json();

        if (existingReview) {
          onReviewUpdated?.(review);
          toast.success("Review updated successfully!");
        } else {
          onReviewSubmitted?.(review);
          toast.success("Review submitted successfully!");
        }

        setIsEditing(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    if (!confirm("Are you sure you want to delete your review?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/workflows/${workflowId}/reviews/${existingReview.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onReviewDeleted?.();
        toast.success("Review deleted successfully!");
        setRating(0);
        setReviewText("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.reviewText || "");
    } else {
      setRating(0);
      setReviewText("");
    }
    setIsEditing(false);
  };

  if (!session?.user?.id) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to leave a review
          </p>
        </CardContent>
      </Card>
    );
  }

  if (existingReview && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Your Review
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < existingReview.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          {existingReview.reviewText && (
            <p className="text-sm text-muted-foreground">
              {existingReview.reviewText}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="text-sm font-medium mb-2 block">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 && `${rating} star${rating > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label
            htmlFor="review-text"
            className="text-sm font-medium mb-2 block"
          >
            Review (optional)
          </label>
          <Textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this workflow..."
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1"
          >
            {isSubmitting
              ? "Submitting..."
              : existingReview
                ? "Update Review"
                : "Submit Review"}
          </Button>
          {existingReview && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
