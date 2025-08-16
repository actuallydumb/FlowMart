"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Zap,
  Users,
  Shield,
  Star,
  ArrowRight,
  Check,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Bot,
  Palette,
  Video,
  FileText,
  Globe,
  TrendingUp,
  Award,
  Play,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

interface Workflow {
  id: string;
  name: string;
  description: string;
  price: number;
  averageRating?: number;
  reviewCount?: number;
  mediaUrls: string[];
  videoUrl?: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  tags: Array<{ id: string; name: string }>;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  createdAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
}

const features = [
  {
    icon: Bot,
    title: "AI-Powered Workflow Generation",
    description:
      "Create workflows instantly with our advanced AI that understands your business needs.",
  },
  {
    icon: Globe,
    title: "Multi-Provider Integrations",
    description:
      "Connect with Google, Notion, Slack, and 100+ other services seamlessly.",
  },
  {
    icon: Shield,
    title: "Secure Marketplace",
    description:
      "All workflows are verified and tested by our expert team for security and reliability.",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description:
      "Make informed decisions with detailed reviews and ratings from real users.",
  },
  {
    icon: FileText,
    title: "Prerequisites & Documentation",
    description:
      "Every workflow comes with detailed setup instructions and documentation.",
  },
  {
    icon: Video,
    title: "Video Guided Installations",
    description:
      "Step-by-step video tutorials to help you implement workflows quickly.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring workflows",
    features: [
      "Browse all workflows",
      "1 workflow download per month",
      "Basic support",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For power users and developers",
    features: [
      "Unlimited workflow downloads",
      "Upload and sell workflows",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per year",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantees",
      "On-premise deployment",
      "Custom training",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function HomePage() {
  const [featuredWorkflows, setFeaturedWorkflows] = useState<Workflow[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workflowsRes, blogsRes, testimonialsRes] = await Promise.all([
          fetch("/api/workflows/featured?limit=6"),
          fetch("/api/blogs?limit=3"),
          fetch("/api/testimonials?limit=4"),
        ]);

        if (workflowsRes.ok) {
          const data = await workflowsRes.json();
          setFeaturedWorkflows(data.workflows);
        }

        if (blogsRes.ok) {
          const data = await blogsRes.json();
          setBlogs(data.blogs);
        }

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          setTestimonials(data.testimonials);
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <motion.div
          className="container mx-auto max-w-6xl relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center mb-6"
          >
            <Package className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold">WorkflowKart</h1>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight"
          >
            Build. Buy. Automate.
            <br />
            <span className="text-4xl md:text-5xl">
              Your Marketplace for Workflows
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover, create, and sell powerful automation workflows. From
            simple email automation to complex enterprise integrations, find
            everything you need to streamline your business processes.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/marketplace">
                Explore Workflows
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/auth/signup?role=seller">
                Start Selling
                <Package className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Example Workflow Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs ml-1">4.8</span>
                    </div>
                  </div>
                  <CardTitle className="text-sm">
                    Email Marketing Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3">
                    Automate your email campaigns with smart triggers and
                    personalization.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">$29</span>
                    <Badge variant="outline" className="text-xs">
                      n8n
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <motion.div
          className="container mx-auto max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">
              Why Choose WorkflowKart?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to build, share, and monetize your automation
              workflows
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-muted/20">
        <motion.div
          className="container mx-auto max-w-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-6">About WorkflowKart</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded in 2024, WorkflowKart was born from the belief that
              automation should be accessible to everyone. We've created a
              platform where developers can monetize their expertise and
              businesses can find ready-to-use automation solutions.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>For Buyers</CardTitle>
                <CardDescription>
                  Find and implement workflows that solve your business
                  challenges instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>For Developers</CardTitle>
                <CardDescription>
                  Monetize your automation expertise by selling workflows to a
                  global audience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>For Admins</CardTitle>
                <CardDescription>
                  Manage and moderate the marketplace to ensure quality and
                  security.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Marketplace Preview Section */}
      <section className="py-20 px-4 bg-background">
        <motion.div
          className="container mx-auto max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Featured Workflows</h3>
            <p className="text-muted-foreground text-lg">
              Discover the most popular and highly-rated workflows from our
              community
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWorkflows.map((workflow) => (
                <motion.div key={workflow.id} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {workflow.tags[0]?.name || "Automation"}
                        </Badge>
                        {workflow.averageRating && (
                          <div className="flex items-center text-yellow-400">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs ml-1">
                              {workflow.averageRating}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {workflow.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {workflow.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-primary">
                          ${workflow.price}
                        </span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          {workflow.user.name}
                        </div>
                      </div>
                      <Button className="w-full" asChild>
                        <Link href={`/workflow/${workflow.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div variants={itemVariants} className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/marketplace">
                View All Workflows
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Blogs Section */}
      <section className="py-20 px-4 bg-muted/20">
        <motion.div
          className="container mx-auto max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Latest from Our Blog</h3>
            <p className="text-muted-foreground text-lg">
              Insights, tutorials, and updates from the automation world
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <motion.div key={blog.id} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {blog.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${blog.slug}`}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">No Blog Posts Yet</h4>
              <p className="text-muted-foreground">
                Check back soon for the latest insights and tutorials.
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-background">
        <motion.div
          className="container mx-auto max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h3>
            <p className="text-muted-foreground text-lg">
              Choose the plan that fits your needs. No hidden fees, no
              surprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className={`h-full relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period !== "forever" && (
                        <span className="text-muted-foreground">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-base mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                      asChild
                    >
                      <Link
                        href={
                          plan.name === "Enterprise"
                            ? "/contact"
                            : "/auth/signup"
                        }
                      >
                        {plan.cta}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/20">
        <motion.div
          className="container mx-auto max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">What Our Users Say</h3>
            <p className="text-muted-foreground text-lg">
              Join thousands of satisfied developers and businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={itemVariants}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <motion.div
          className="container mx-auto max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-4xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers and businesses already using
              WorkflowKart
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-6"
                asChild
              >
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/marketplace">Explore Workflows</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
