"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, X } from "lucide-react";
import { WorkflowWithUser } from "@/types";
import { workflowSchema } from "@/types";
import { toast } from "sonner";

interface EditWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: WorkflowWithUser | null;
  onWorkflowUpdated: (workflow: WorkflowWithUser) => void;
}

export function EditWorkflowDialog({
  open,
  onOpenChange,
  workflow,
  onWorkflowUpdated,
}: EditWorkflowDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      prerequisites: "",
      documentation: "",
      videoUrl: "",
    },
  });

  const watchedVideoUrl = watch("videoUrl");

  const availableTags = [
    "Email",
    "Marketing",
    "Automation",
    "CRM",
    "Integration",
    "Data",
    "Social Media",
    "Scheduling",
    "Analytics",
    "E-commerce",
  ];

  // Pre-fill form when workflow changes
  useEffect(() => {
    if (workflow) {
      setValue("name", workflow.name);
      setValue("description", workflow.description);
      setValue("price", workflow.price);
      setValue("prerequisites", workflow.prerequisites || "");
      setValue("documentation", workflow.documentation || "");
      setValue("videoUrl", workflow.videoUrl || "");
      setSelectedTags(workflow.tags.map((tag) => tag.name));
      setMediaUrls(workflow.mediaUrls || []);
    }
  }, [workflow, setValue]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addMediaUrl = () => {
    if (newMediaUrl.trim() && !mediaUrls.includes(newMediaUrl.trim())) {
      setMediaUrls([...mediaUrls, newMediaUrl.trim()]);
      setNewMediaUrl("");
    }
  };

  const removeMediaUrl = (url: string) => {
    setMediaUrls(mediaUrls.filter((u) => u !== url));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: any) => {
    if (!workflow) return;

    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, use the existing file URL since we're editing
      const fileUrl = workflow.fileUrl;

      // Update workflow in database
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: data.price,
          fileUrl,
          tags: selectedTags,
          prerequisites: data.prerequisites || undefined,
          documentation: data.documentation || undefined,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
          videoUrl: data.videoUrl || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update workflow");
      }

      const updatedWorkflow = await response.json();

      toast.success("Workflow updated successfully!");
      onWorkflowUpdated(updatedWorkflow);
      onOpenChange(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update workflow"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (workflow) {
      setValue("name", workflow.name);
      setValue("description", workflow.description);
      setValue("price", workflow.price);
      setValue("prerequisites", workflow.prerequisites || "");
      setValue("documentation", workflow.documentation || "");
      setValue("videoUrl", workflow.videoUrl || "");
      setSelectedTags(workflow.tags.map((tag) => tag.name));
      setMediaUrls(workflow.mediaUrls || []);
    }
    onOpenChange(false);
  };

  if (!workflow) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workflow</DialogTitle>
          <DialogDescription>
            Update your workflow details. Changes will require re-approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter workflow name"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe your workflow and its features"
                className="mt-1"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price")}
                placeholder="0.00"
                className="mt-1"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message as string}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
              <Textarea
                id="prerequisites"
                {...register("prerequisites")}
                placeholder="List any setup requirements or prerequisites needed before using this workflow..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="documentation">Documentation (Optional)</Label>
              <Textarea
                id="documentation"
                {...register("documentation")}
                placeholder="Provide detailed instructions on how to use this workflow..."
                className="mt-1"
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="videoUrl">Demo Video URL (Optional)</Label>
              <Input
                id="videoUrl"
                type="url"
                {...register("videoUrl")}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="mt-1"
              />
              {errors.videoUrl && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.videoUrl.message as string}
                </p>
              )}
            </div>

            <div>
              <Label>Media URLs (Optional)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://example.com/screenshot.jpg"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMediaUrl();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMediaUrl}
                  disabled={!newMediaUrl.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {mediaUrls.length > 0 && (
                <div className="mt-2 space-y-1">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground flex-1 truncate">
                        {url}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMediaUrl(url)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {selectedTags.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Please select at least one tag
                </p>
              )}
            </div>

            <div>
              <Label>Current File</Label>
              <div className="mt-1 p-3 border rounded-md bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  {workflow.fileUrl}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  File cannot be changed during editing. Create a new workflow
                  version to upload a new file.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Workflow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
