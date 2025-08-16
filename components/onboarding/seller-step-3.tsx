"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUploadThing } from "@/lib/uploadthing-config";
import { Upload, FileText, Image, X, AlertCircle, Clock } from "lucide-react";

interface SellerStep3Props {
  onNext: (data: any) => void;
  onPrevious: () => void;
  isSaving: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
}

export default function SellerStep3({
  onNext,
  onPrevious,
  isSaving,
}: SellerStep3Props) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Use ref to reset file input value after upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Make sure the route name matches your uploadthing config
  const { startUpload, isUploading: isUploadThingUploading } =
    useUploadThing("verificationDocs");

  // Helper to check file constraints
  const validateFiles = (files: FileList): string | null => {
    if (files.length > 5) {
      return "You can upload up to 5 files only.";
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        return `File "${file.name}" is not a supported format.`;
      }
      if (file.size > 8 * 1024 * 1024) {
        return `File "${file.name}" exceeds the 8MB size limit.`;
      }
    }
    return null;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check total file count (already uploaded + new)
    if (uploadedFiles.length + files.length > 5) {
      setUploadError("You can upload up to 5 files in total.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file types and sizes
    const validationError = validateFiles(files);
    if (validationError) {
      setUploadError(validationError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // UploadThing expects an array of File objects
      const fileArray = Array.from(files);

      // Defensive: check if there are files to upload
      if (fileArray.length === 0) {
        setUploadError("No files selected for upload.");
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // startUpload returns an array of { url, key, name, type }
      const uploaded = await startUpload(fileArray);

      // Defensive: check if upload result is valid and matches input
      if (
        uploaded &&
        Array.isArray(uploaded) &&
        uploaded.length === fileArray.length &&
        uploaded.every((file) => file && file.url)
      ) {
        // Map uploaded files to our UploadedFile type
        const newFiles: UploadedFile[] = uploaded.map((file, idx) => ({
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: fileArray[idx]?.name || file.name,
          url: file.url,
          type: file.type,
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);
      } else if (uploaded && uploaded.length > 0) {
        // Some files uploaded, but not all
        const newFiles: UploadedFile[] = uploaded
          .filter((file) => file && file.url)
          .map((file, idx) => ({
            id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: fileArray[idx]?.name || file.name,
            url: file.url,
            type: file.type,
          }));

        if (newFiles.length > 0) {
          setUploadedFiles((prev) => [...prev, ...newFiles]);
          setUploadError(
            "Some files may not have uploaded successfully. Please check your files."
          );
        } else {
          setUploadError(
            "No files were uploaded. Please check your file types and try again."
          );
        }
      } else {
        setUploadError(
          "No files were uploaded. Please check your file types and try again."
        );
      }
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? `Upload failed: ${error.message}`
          : "Failed to upload files. Please try again."
      );
    } finally {
      setIsUploading(false);
      // Reset file input so user can re-upload the same file if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleNext = () => {
    if (uploadedFiles.length === 0) {
      setUploadError("Please upload at least one document before submitting.");
      return;
    }

    onNext({
      step: "seller-3",
      verificationDocs: uploadedFiles.map((file) => file.url),
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    return FileText;
  };
``
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Verification Documents</h3>
        <p className="text-muted-foreground">
          Upload documents to verify your identity and expertise. This helps
          build trust with buyers.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h4 className="font-medium mb-2">Upload Documents</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Accepted formats: PDF, JPG, PNG (Max 8MB each, up to 5 files)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={
                  isUploading ||
                  isUploadThingUploading ||
                  uploadedFiles.length >= 5
                }
              />

              <label
                htmlFor="file-upload"
                onClick={(e) => {
                  // If button is disabled, prevent label from triggering file input
                  if (
                    isUploading ||
                    isUploadThingUploading ||
                    uploadedFiles.length >= 5
                  ) {
                    e.preventDefault();
                  }
                }}
                style={{
                  cursor:
                    isUploading ||
                    isUploadThingUploading ||
                    uploadedFiles.length >= 5
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={
                    isUploading ||
                    isUploadThingUploading ||
                    uploadedFiles.length >= 5
                  }
                  type="button"
                  tabIndex={0}
                  onClick={(e) => {
                    // Prevent file dialog if disabled
                    if (
                      isUploading ||
                      isUploadThingUploading ||
                      uploadedFiles.length >= 5
                    ) {
                      e.preventDefault();
                      return;
                    }
                    // Manually trigger file input if not disabled
                    fileInputRef.current?.click();
                  }}
                >
                  {isUploading || isUploadThingUploading
                    ? "Uploading..."
                    : uploadedFiles.length >= 5
                      ? "Max Files Reached"
                      : "Choose Files"}
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {uploadError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {uploadError}
            </p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">
              Uploaded Documents ({uploadedFiles.length})
            </h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.type}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Required Documents</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Government-issued ID (passport, driver's license)</li>
                <li>• Professional certifications or degrees</li>
                <li>• Portfolio or work samples</li>
                <li>• Business registration (if applicable)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Review Process</h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your application will be reviewed by our team within 2-3
                business days. You'll receive an email notification once the
                review is complete.
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
          onClick={handleNext}
          disabled={
            uploadedFiles.length === 0 ||
            isSaving ||
            isUploading ||
            isUploadThingUploading
          }
          className="min-w-[100px]"
        >
          {isSaving ? "Saving..." : "Submit for Review"}
        </Button>
      </div>
    </div>
  );
}
