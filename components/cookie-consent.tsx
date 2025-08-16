"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Cookie,
  Settings,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem("cookie-consent", JSON.stringify(essentialOnly));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShowSettings(false);
    setShowBanner(false);
  };

  const handlePreferenceChange = (
    key: keyof CookiePreferences,
    value: boolean
  ) => {
    if (key === "essential") return; // Essential cookies cannot be disabled
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cookie className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">We use cookies</CardTitle>
                      <CardDescription>
                        We use cookies to enhance your experience and analyze
                        our traffic.
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBanner(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptEssential}
                    variant="outline"
                    className="flex-1"
                  >
                    Essential Only
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                  <Button onClick={handleAcceptAll} className="flex-1">
                    Accept All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-xl">Cookie Settings</CardTitle>
                    <CardDescription>
                      Manage your cookie preferences for this website
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Essential Cookies */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <Label className="font-semibold">Essential Cookies</Label>
                    <p className="text-sm text-muted-foreground">
                      Required for the website to function properly
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={preferences.essential} disabled />
                  <Badge variant="secondary">Required</Badge>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-blue-600" />
                  <div>
                    <Label className="font-semibold">Analytics Cookies</Label>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how visitors use our website
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("analytics", checked)
                  }
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-purple-600" />
                  <div>
                    <Label className="font-semibold">Marketing Cookies</Label>
                    <p className="text-sm text-muted-foreground">
                      Used to deliver relevant advertisements
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("marketing", checked)
                  }
                />
              </div>

              {/* Preference Cookies */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <div>
                    <Label className="font-semibold">Preference Cookies</Label>
                    <p className="text-sm text-muted-foreground">
                      Remember your choices and settings
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.preferences}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("preferences", checked)
                  }
                />
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-800 text-sm leading-relaxed">
                  Essential cookies cannot be disabled as they are necessary for
                  the platform to work properly. Disabling other cookies may
                  affect your experience.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleSavePreferences} className="flex-1">
                  Save Preferences
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1"
                >
                  Accept All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
