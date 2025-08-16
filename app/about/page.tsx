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
  Target,
  Eye,
  Users,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Heart,
  Lightbulb,
  Rocket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - WorkflowHub",
  description:
    "Learn about our mission to democratize workflow automation and empower businesses worldwide.",
};

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description:
      "Constantly pushing boundaries to create cutting-edge automation solutions.",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "Enterprise-grade security to protect your workflows and data.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a global community of developers and businesses.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making automation accessible to businesses of all sizes.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "Supporting continuous learning and business growth.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "Every decision we make is centered around customer success.",
  },
];

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    bio: "Former automation engineer at Google, passionate about democratizing workflow automation.",
    image: "/team/alex.jpg",
  },
  {
    name: "Sarah Johnson",
    role: "CTO",
    bio: "Full-stack architect with 10+ years building scalable platforms.",
    image: "/team/sarah.jpg",
  },
  {
    name: "Marcus Rodriguez",
    role: "Head of Product",
    bio: "Product leader focused on creating intuitive user experiences.",
    image: "/team/marcus.jpg",
  },
  {
    name: "Priya Patel",
    role: "Head of Design",
    bio: "Design systems expert creating beautiful, functional interfaces.",
    image: "/team/priya.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              About WorkflowHub
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
              Revolutionizing Workflow Automation
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize workflow automation, making
              powerful business tools accessible to everyone.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">
                      Our Mission
                    </CardTitle>
                    <CardDescription>What drives us forward</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                  To democratize workflow automation by creating a global
                  marketplace where developers can share their expertise and
                  businesses can access powerful automation tools without the
                  complexity of building from scratch.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Eye className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">
                      Our Vision
                    </CardTitle>
                    <CardDescription>Where we're heading</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                  A world where every business, regardless of size or technical
                  expertise, can leverage the power of automation to streamline
                  operations, reduce costs, and focus on what matters most.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind WorkflowHub
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                10K+
              </div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                500+
              </div>
              <div className="text-muted-foreground">Workflows</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                50+
              </div>
              <div className="text-muted-foreground">Developers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                99.9%
              </div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="pb-6">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of businesses already automating their workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/marketplace"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Explore Workflows
                </a>
                <a
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Join as Developer
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
