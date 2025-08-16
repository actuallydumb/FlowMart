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
  FileText,
  Shield,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Mail,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - WorkflowKart",
  description: "Read our terms of service and user agreement.",
};

const termsSections = [
  {
    icon: Users,
    title: "User Accounts",
    content: [
      "You must be at least 18 years old to create an account",
      "Provide accurate and complete information",
      "Maintain the security of your account credentials",
      "Notify us immediately of any unauthorized access",
      "You are responsible for all activities under your account",
    ],
  },
  {
    icon: FileText,
    title: "Acceptable Use",
    content: [
      "Use the platform for lawful purposes only",
      "Respect intellectual property rights",
      "Do not upload malicious or harmful content",
      "Do not attempt to gain unauthorized access",
      "Do not interfere with platform functionality",
    ],
  },
  {
    icon: CreditCard,
    title: "Payment Terms",
    content: [
      "All prices are in USD unless otherwise stated",
      "Payments are processed securely through Stripe",
      "No refunds for digital workflow purchases",
      "Subscription fees are billed in advance",
      "We reserve the right to change pricing with notice",
    ],
  },
  {
    icon: Shield,
    title: "Intellectual Property",
    content: [
      "WorkflowKart retains rights to platform and services",
      "Developers retain rights to their uploaded workflows",
      "Users receive license to use purchased workflows",
      "No redistribution of purchased workflows",
      "Respect copyright and trademark rights",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Activities",
    content: [
      "Uploading copyrighted material without permission",
      "Creating fake accounts or impersonating others",
      "Attempting to reverse engineer the platform",
      "Using automated tools to access the service",
      "Engaging in fraudulent or deceptive practices",
    ],
  },
  {
    icon: CheckCircle,
    title: "User Responsibilities",
    content: [
      "Comply with all applicable laws and regulations",
      "Respect other users' rights and privacy",
      "Provide accurate workflow descriptions",
      "Maintain workflow functionality and updates",
      "Report violations and security issues",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <FileText className="h-4 w-4 mr-2" />
              Terms of Service
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
              Terms of Service
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our workflow
              automation marketplace.
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
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed">
              <p>
                These Terms of Service ("Terms") govern your use of
                WorkflowKart's workflow automation marketplace and related
                services. By accessing or using our platform, you agree to be
                bound by these Terms.
              </p>
              <p>
                If you disagree with any part of these terms, you may not access
                our service. These Terms apply to all visitors, users, and
                others who access or use the service.
              </p>
              <p>
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes by posting the new Terms on
                this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {termsSections.map((section, index) => (
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

      {/* Service Description */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Scale className="h-6 w-6" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Platform Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  WorkflowKart is a marketplace that connects developers who
                  create workflow automation solutions with businesses and
                  individuals who need them. Our platform facilitates the
                  buying, selling, and distribution of workflow automation
                  tools.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">For Developers</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Upload and sell your workflow automation solutions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Set your own pricing and licensing terms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Receive payments through our secure system
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Access analytics and customer feedback
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">For Buyers</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Browse and purchase workflow automation solutions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Download and use purchased workflows
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Access support and documentation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Provide feedback and ratings
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <AlertTriangle className="h-6 w-6" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Service Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to maintain high availability but cannot guarantee
                  uninterrupted service. We may temporarily suspend the service
                  for maintenance or updates.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Workflow Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We do not guarantee the quality, accuracy, or functionality of
                  workflows sold on our platform. Users should review workflows
                  before purchase and contact developers for support.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  WorkflowKart shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages resulting from
                  your use of the service.
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
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> legal@workflowkart.com
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
                Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes by posting the new Terms on
                this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
