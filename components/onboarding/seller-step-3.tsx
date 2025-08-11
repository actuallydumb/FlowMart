"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Image,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // Simulate file upload - in real implementation, this would use UploadThing
      const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file), // This would be the actual uploaded URL
        type: file.type,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleNext = () => {
    if (uploadedFiles.length === 0) {
      return;
    }

    onNext({
      step: 3,
      verificationDocs: uploadedFiles.map((file) => file.url),
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    return FileText;
  };

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
                Accepted formats: PDF, JPG, PNG (Max 10MB each)
              </p>

              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />

              <label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Choose Files"}
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

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
          disabled={uploadedFiles.length === 0 || isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? "Saving..." : "Submit for Review"}
        </Button>
      </div>
    </div>
  );
}
