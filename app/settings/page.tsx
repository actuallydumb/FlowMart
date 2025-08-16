"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Key,
  Mail,
  Globe,
  Moon,
  Sun,
  Settings as SettingsIcon,
  Save,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { hasRole } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const notificationSettings = [
  {
    id: "email_notifications",
    title: "Email Notifications",
    description: "Receive notifications via email",
    enabled: true,
  },
  {
    id: "workflow_updates",
    title: "Workflow Updates",
    description: "Get notified when workflows you own are updated",
    enabled: true,
  },
  {
    id: "new_features",
    title: "New Features",
    description: "Learn about new features and improvements",
    enabled: false,
  },
  {
    id: "marketing",
    title: "Marketing Emails",
    description: "Receive promotional emails and special offers",
    enabled: false,
  },
];

const connectedAccounts = [
  {
    provider: "Google",
    email: "user@gmail.com",
    connected: true,
    icon: "🔗",
  },
  {
    provider: "GitHub",
    email: "user@github.com",
    connected: false,
    icon: "🔗",
  },
  {
    provider: "Slack",
    email: "user@slack.com",
    connected: false,
    icon: "🔗",
  },
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      bio: "",
      website: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const isDeveloper =
    session?.user?.roles && hasRole(session.user.roles, "DEVELOPER");
  const isVerified = session?.user?.sellerVerificationStatus === "APPROVED";

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    setUpdateStatus("idle");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setUpdateStatus("success");
        // Update session
        await update();
      } else {
        setUpdateStatus("error");
      }
    } catch (error) {
      setUpdateStatus("error");
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdating(true);
    setUpdateStatus("idle");

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setUpdateStatus("success");
        passwordForm.reset();
      } else {
        setUpdateStatus("error");
      }
    } catch (error) {
      setUpdateStatus("error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Please sign in to access your settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Verification Status for Developers */}
        {isDeveloper && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  {isVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <h3 className="font-semibold">Developer Verification</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isVerified
                        ? "Your account is verified and you can sell workflows"
                        : "Your account is pending verification. You cannot sell workflows until approved."}
                    </p>
                  </div>
                </div>
                {!isVerified && <Badge variant="secondary">Pending</Badge>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-base">
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...profileForm.register("name")}
                        placeholder="Your full name"
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...profileForm.register("email")}
                        placeholder="your@email.com"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      {...profileForm.register("bio")}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      {...profileForm.register("website")}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  {/* Status Messages */}
                  {updateStatus === "success" && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800">
                        Profile updated successfully!
                      </p>
                    </div>
                  )}

                  {updateStatus === "error" && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <p className="text-red-800">
                        Failed to update profile. Please try again.
                      </p>
                    </div>
                  )}

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-base">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register("currentPassword")}
                      placeholder="Enter current password"
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register("newPassword")}
                        placeholder="Enter new password"
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-500">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                        placeholder="Confirm new password"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {
                            passwordForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription className="text-base">
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Protect your account with 2FA
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-base">
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {notificationSettings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium">{setting.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {setting.description}
                        </p>
                      </div>
                      <Switch defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Globe className="h-5 w-5" />
                  Connected Accounts
                </CardTitle>
                <CardDescription className="text-base">
                  Manage your connected third-party accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedAccounts.map((account) => (
                    <div
                      key={account.provider}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{account.icon}</span>
                        <div>
                          <p className="font-medium">{account.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.connected ? (
                          <Badge variant="secondary">Connected</Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
