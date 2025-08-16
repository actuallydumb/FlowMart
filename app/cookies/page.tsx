import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cookie,
  Settings,
  Shield,
  Database,
  Eye,
  Target,
  Calendar,
  Mail,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy - WorkflowKart",
  description: "Learn about how we use cookies and manage your preferences.",
};

const cookieTypes = [
  {
    icon: Shield,
    title: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function properly.",
    examples: [
      "Authentication and session management",
      "Security features and fraud prevention",
      "Basic platform functionality",
      "Shopping cart and checkout process",
    ],
    duration: "Session to 1 year",
    canDisable: false,
  },
  {
    icon: Database,
    title: "Analytics Cookies",
    description:
      "These cookies help us understand how visitors interact with our website.",
    examples: [
      "Page views and navigation patterns",
      "User behavior and preferences",
      "Performance monitoring",
      "Error tracking and debugging",
    ],
    duration: "2 years",
    canDisable: true,
  },
  {
    icon: Target,
    title: "Marketing Cookies",
    description:
      "These cookies are used to deliver relevant advertisements and content.",
    examples: [
      "Personalized advertising",
      "Social media integration",
      "Email marketing campaigns",
      "Retargeting and remarketing",
    ],
    duration: "1 year",
    canDisable: true,
  },
  {
    icon: Settings,
    title: "Preference Cookies",
    description: "These cookies remember your choices and preferences.",
    examples: [
      "Language and region settings",
      "Theme and display preferences",
      "Notification preferences",
      "Search history and filters",
    ],
    duration: "1 year",
    canDisable: true,
  },
];

const thirdPartyCookies = [
  {
    name: "Google Analytics",
    purpose: "Website analytics and performance monitoring",
    privacyPolicy: "https://policies.google.com/privacy",
  },
  {
    name: "Stripe",
    purpose: "Payment processing and security",
    privacyPolicy: "https://stripe.com/privacy",
  },
  {
    name: "UploadThing",
    purpose: "File upload and storage services",
    privacyPolicy: "https://uploadthing.com/privacy",
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Cookie className="h-4 w-4 mr-2" />
              Cookie Policy
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
              Cookie Policy
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Learn about how we use cookies and manage your preferences to
              enhance your experience.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl sm:text-2xl">
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed">
              <p>
                Cookies are small text files that are stored on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences, analyzing how you
                use our site, and personalizing content.
              </p>
              <p>
                We use cookies to make our website work properly, improve its
                functionality, and provide you with relevant content and
                advertisements.
              </p>
              <p>
                By continuing to use our website, you consent to our use of
                cookies as described in this policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Types of Cookies We Use
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We use different types of cookies for various purposes
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {cookieTypes.map((cookie, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <cookie.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">
                        {cookie.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={cookie.canDisable ? "outline" : "secondary"}
                          className="text-xs"
                        >
                          {cookie.canDisable ? "Optional" : "Required"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {cookie.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {cookie.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Examples:</h4>
                    <ul className="space-y-2">
                      {cookie.examples.map((example, exampleIndex) => (
                        <li
                          key={exampleIndex}
                          className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Third Party Cookies */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Info className="h-6 w-6" />
                Third-Party Cookies
              </CardTitle>
              <CardDescription className="text-base">
                We also use cookies from trusted third-party services to enhance
                our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thirdPartyCookies.map((service, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.purpose}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={service.privacyPolicy}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                        <Eye className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Settings className="h-6 w-6" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Browser Settings</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can control and manage cookies through your browser
                  settings. Most browsers allow you to:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    View and delete existing cookies
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Block cookies from specific websites
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Set preferences for different types of cookies
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Clear cookies when you close your browser
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Important Note</h3>
                <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    Disabling certain cookies may affect the functionality of
                    our website. Essential cookies cannot be disabled as they
                    are necessary for the platform to work properly.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cookie Consent</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you first visit our website, you'll see a cookie consent
                  banner that allows you to choose which types of cookies you
                  want to accept. You can change these preferences at any time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Settings */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl sm:text-2xl">
                Manage Cookie Settings
              </CardTitle>
              <CardDescription className="text-base">
                Customize your cookie preferences for this website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Click the button below to open our cookie settings panel where
                  you can manage your preferences.
                </p>
                <Button size="lg" className="w-full sm:w-auto">
                  <Settings className="h-4 w-4 mr-2" />
                  Cookie Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Mail className="h-6 w-6" />
                Questions About Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies or this
                Cookie Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> privacy@workflowkart.com
                </p>
                <p>
                  <strong>Subject:</strong> Cookie Policy Inquiry
                </p>
                <p>
                  <strong>Response Time:</strong> We aim to respond within 48
                  hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Updates Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl sm:text-2xl">
                Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. We will notify you of any material changes
                by posting the new policy on this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
