"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, X, Plus } from "lucide-react";
import { workflowSchema, WorkflowWithUser } from "@/types";
import { toast } from "sonner";

interface UploadWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkflowUploaded: (workflow: WorkflowWithUser) => void;
}

interface Tag {
  id: string;
  name: string;
  workflowCount: number;
}

export function UploadWorkflowDialog({
  open,
  onOpenChange,
  onWorkflowUploaded,
}: UploadWorkflowDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const form = useForm({
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

  const { watch } = form;
  const watchedVideoUrl = watch("videoUrl");

  useEffect(() => {
    if (open) {
      fetchTags();
    }
  }, [open]);

  const fetchTags = async () => {
    try {
      setIsLoadingTags(true);
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setAvailableTags(data.tags);
      } else {
        toast.error("Failed to fetch tags");
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to fetch tags");
    } finally {
      setIsLoadingTags(false);
    }
  };

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
    // Remove excessive console logs for production
    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a workflow file");
      return;
    }

    setIsUploading(true);

    try {
      // For now, create a mock file URL since UploadThing needs credentials
      const mockFileUrl = `https://example.com/workflows/${selectedFile.name}`;

      // Create workflow in database
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: data.price,
          fileUrl: mockFileUrl,
          tags: selectedTags,
          prerequisites: data.prerequisites || undefined,
          documentation: data.documentation || undefined,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
          videoUrl: data.videoUrl || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create workflow");
      }

      const newWorkflow = await response.json();

      toast.success("Workflow uploaded successfully!");
      onWorkflowUploaded(newWorkflow);
      reset();
      setSelectedTags([]);
      setMediaUrls([]);
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload workflow"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    form.reset();
    setSelectedTags([]);
    setMediaUrls([]);
    setNewMediaUrl("");
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Workflow</DialogTitle>
          <DialogDescription>
            Share your automation workflow with the community. Fill in the
            details below to get started.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workflow Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter workflow name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear, descriptive name for your workflow.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what your workflow does, its benefits, and use cases..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description to help users understand
                      your workflow.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="29.99"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Set a fair price for your workflow. You'll receive 70% of
                      each sale.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags Selection */}
            <div className="space-y-4">
              <FormLabel>Tags *</FormLabel>
              {isLoadingTags ? (
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-20" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={
                        selectedTags.includes(tag.name) ? "default" : "outline"
                      }
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => toggleTag(tag.name)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              <FormDescription>
                Select relevant tags to help users find your workflow. Choose at
                least one.
              </FormDescription>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <FormLabel>Workflow File *</FormLabel>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload your workflow file (JSON, YAML, or ZIP)
                </p>
                <input
                  type="file"
                  accept=".json,.yaml,.yml,.zip"
                  onChange={handleFileChange}
                  className="hidden"
                  id="workflow-file"
                />
                <label htmlFor="workflow-file">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Choose File
                  </Button>
                </label>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="prerequisites"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prerequisites</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any requirements or setup needed before using this workflow..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify any tools, accounts, or setup required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documentation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed instructions on how to use this workflow..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include step-by-step instructions for implementation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add a YouTube or Vimeo URL for a demo video.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Media URLs */}
            <div className="space-y-4">
              <FormLabel>Screenshot URLs</FormLabel>
              <div className="space-y-2">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input value={url} readOnly />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMediaUrl(url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="https://example.com/screenshot.png"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMediaUrl}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FormDescription>
                Add URLs to screenshots or images of your workflow in action.
              </FormDescription>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Workflow"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
