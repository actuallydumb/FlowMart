"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Image } from "lucide-react";

interface MediaGalleryProps {
  images: string[];
  videoUrl?: string;
}

export function MediaGallery({ images, videoUrl }: MediaGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  if (images.length === 0 && !videoUrl) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
      const videoId = url.includes("youtu.be/")
        ? url.split("youtu.be/")[1]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Media Gallery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Section */}
        {videoUrl && (
          <div className="space-y-2">
            <h4 className="font-medium">Demo Video</h4>
            {showVideo ? (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVideo(false)}
                  className="absolute top-2 right-2 z-10"
                >
                  Close
                </Button>
                <iframe
                  src={getVideoEmbedUrl(videoUrl)}
                  className="w-full aspect-video rounded-lg"
                  allowFullScreen
                  title="Workflow Demo"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={images[0] || "/placeholder-video.jpg"}
                  alt="Video thumbnail"
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <Button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 hover:bg-black/70"
                >
                  <Play className="h-8 w-8 text-white" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Images Section */}
        {images.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Screenshots</h4>
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={`Screenshot ${currentImageIndex + 1}`}
                className="w-full aspect-video object-cover rounded-lg"
              />

              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-1">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <p className="text-sm text-muted-foreground text-center">
                {currentImageIndex + 1} of {images.length}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
