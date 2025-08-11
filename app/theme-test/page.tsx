"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeTestPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setTheme("light")}
                variant={resolvedTheme === "light" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                onClick={() => setTheme("dark")}
                variant={resolvedTheme === "dark" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                onClick={() => setTheme("system")}
                variant={theme === "system" ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Current Theme:</strong> {theme}
              </p>
              <p>
                <strong>Resolved Theme:</strong> {resolvedTheme}
              </p>
              <p>
                <strong>Mounted:</strong> {mounted ? "Yes" : "No"}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-card text-card-foreground">
              <p>This is a test card to verify dark mode styling.</p>
              <p className="text-muted-foreground">
                This text should be muted in both themes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary text-primary-foreground rounded-lg">
                Primary Color
              </div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
                Secondary Color
              </div>
              <div className="p-4 bg-muted text-muted-foreground rounded-lg">
                Muted Color
              </div>
              <div className="p-4 bg-accent text-accent-foreground rounded-lg">
                Accent Color
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
