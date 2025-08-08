import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "WorkflowHub - Automation Workflow Marketplace",
  description:
    "Upload, sell, and share automation workflows. Find the perfect workflow for your needs.",
  keywords: "automation, workflows, marketplace, n8n, zapier, scripts",
  authors: [{ name: "WorkflowHub Team" }],
  openGraph: {
    title: "WorkflowHub - Automation Workflow Marketplace",
    description:
      "Upload, sell, and share automation workflows. Find the perfect workflow for your needs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
