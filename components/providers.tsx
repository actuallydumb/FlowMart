"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { UploadThingProvider } from "@uploadthing/react";
import { uploadRouter } from "@/lib/uploadthing";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UploadThingProvider uploadRouter={uploadRouter}>
        {children}
        <Toaster position="top-right" />
      </UploadThingProvider>
    </SessionProvider>
  );
}
