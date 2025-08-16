import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorkflowKart - Your Marketplace for Workflows",
  description:
    "Build, buy, and automate your business processes with powerful workflows from our marketplace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
