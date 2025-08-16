import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  Globe,
  Calendar,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - WorkflowKart",
  description: "Learn how we protect and handle your personal information.",
};

const privacySections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: [
      "Personal information (name, email, contact details)",
      "Account information and preferences",
      "Usage data and analytics",
      "Payment information (processed securely by Stripe)",
      "Communication records and support interactions",
    ],
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content: [
      "Provide and maintain our services",
      "Process transactions and payments",
      "Send important updates and notifications",
      "Improve our platform and user experience",
      "Provide customer support and assistance",
      "Comply with legal obligations",
    ],
  },
  {
    icon: Users,
    title: "Information Sharing",
    content: [
      "We do not sell your personal information",
      "Share with trusted service providers (payment processors, hosting)",
      "Comply with legal requirements and court orders",
      "Protect our rights and prevent fraud",
      "With your explicit consent",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "Industry-standard encryption for data transmission",
      "Secure data storage with access controls",
      "Regular security audits and updates",
      "Employee training on data protection",
      "Incident response procedures",
    ],
  },
  {
    icon: Globe,
    title: "Data Retention",
    content: [
      "Account data: Retained while account is active",
      "Transaction records: 7 years for tax purposes",
      "Support communications: 3 years",
      "Analytics data: 2 years",
      "Right to request data deletion",
    ],
  },
  {
    icon: Shield,
    title: "Your Rights",
    content: [
      "Access your personal information",
      "Correct inaccurate data",
      "Request data deletion",
      "Opt-out of marketing communications",
      "Data portability",
      "Lodge complaints with authorities",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Shield className="h-4 w-4 mr-2" />
              Privacy Policy
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
              Your Privacy Matters
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and ensuring the
              security of your personal information.
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
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed">
              <p>
                At WorkflowKart, we respect your privacy and are committed to
                protecting your personal information. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our workflow automation marketplace.
              </p>
              <p>
                By using our services, you agree to the collection and use of
                information in accordance with this policy. We will not use or
                share your information with anyone except as described in this
                Privacy Policy.
              </p>
              <p>
                This policy applies to all users of our platform, including
                buyers, developers, and administrators.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {privacySections.map((section, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cookies Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Database className="h-6 w-6" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What are Cookies?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files stored on your device that help
                  us provide and improve our services. They enable certain
                  features and remember your preferences.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How We Use Cookies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Essential cookies for platform functionality
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Analytics cookies to understand usage patterns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Preference cookies to remember your settings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Marketing cookies for relevant content (with consent)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Managing Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You can control and manage cookies through your browser
                  settings. However, disabling certain cookies may affect the
                  functionality of our platform.
                </p>
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
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> privacy@workflowkart.com
                </p>
                <p>
                  <strong>Address:</strong> WorkflowKart Inc., San Francisco, CA
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
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
