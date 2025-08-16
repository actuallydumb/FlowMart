import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  BookOpen,
  Tag,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - WorkflowHub",
  description:
    "Latest insights, tutorials, and updates from the WorkflowHub team.",
};

const blogPosts = [
  {
    id: "1",
    title: "The Future of Workflow Automation in 2024",
    excerpt:
      "Discover the latest trends and technologies that are shaping the future of business automation.",
    content: "Full article content here...",
    author: "Alex Chen",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    category: "Trends",
    tags: ["Automation", "AI", "Productivity"],
    featured: true,
    image: "/blog/future-automation.jpg",
  },
  {
    id: "2",
    title: "How to Build Scalable Workflows for Enterprise",
    excerpt:
      "Learn the best practices for creating workflows that can handle enterprise-level demands.",
    content: "Full article content here...",
    author: "Sarah Johnson",
    publishedAt: "2024-01-12",
    readTime: "8 min read",
    category: "Tutorial",
    tags: ["Enterprise", "Scalability", "Best Practices"],
    featured: false,
    image: "/blog/enterprise-workflows.jpg",
  },
  {
    id: "3",
    title: "Integrating AI into Your Existing Workflows",
    excerpt:
      "A comprehensive guide to adding AI capabilities to your current automation processes.",
    content: "Full article content here...",
    author: "Marcus Rodriguez",
    publishedAt: "2024-01-10",
    readTime: "6 min read",
    category: "AI",
    tags: ["AI", "Integration", "Machine Learning"],
    featured: false,
    image: "/blog/ai-integration.jpg",
  },
  {
    id: "4",
    title: "Top 10 Workflow Automation Tools for Small Businesses",
    excerpt:
      "Compare the best automation tools that are perfect for small business needs and budgets.",
    content: "Full article content here...",
    author: "Priya Patel",
    publishedAt: "2024-01-08",
    readTime: "7 min read",
    category: "Tools",
    tags: ["Small Business", "Tools", "Comparison"],
    featured: false,
    image: "/blog/small-business-tools.jpg",
  },
  {
    id: "5",
    title: "Security Best Practices for Workflow Automation",
    excerpt:
      "Essential security measures to protect your automated workflows and sensitive data.",
    content: "Full article content here...",
    author: "Alex Chen",
    publishedAt: "2024-01-05",
    readTime: "4 min read",
    category: "Security",
    tags: ["Security", "Best Practices", "Data Protection"],
    featured: false,
    image: "/blog/security-practices.jpg",
  },
  {
    id: "6",
    title: "Case Study: How Company X Increased Productivity by 300%",
    excerpt:
      "Real-world example of how workflow automation transformed a company's operations.",
    content: "Full article content here...",
    author: "Sarah Johnson",
    publishedAt: "2024-01-03",
    readTime: "9 min read",
    category: "Case Study",
    tags: ["Case Study", "Productivity", "ROI"],
    featured: false,
    image: "/blog/case-study.jpg",
  },
];

const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Trends", count: 1 },
  { name: "Tutorial", count: 1 },
  { name: "AI", count: 1 },
  { name: "Tools", count: 1 },
  { name: "Security", count: 1 },
  { name: "Case Study", count: 1 },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight">
              Latest Insights & Updates
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Stay up to date with the latest trends, tutorials, and insights in
              workflow automation.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
              {categories.map((category) => (
                <Badge
                  key={category.name}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {blogPosts
            .filter((post) => post.featured)
            .map((post) => (
              <Card
                key={post.id}
                className="border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5 overflow-hidden"
              >
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary">{post.category}</Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <TrendingUp className="h-3 w-3" />
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl mb-4 leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg mb-6 leading-relaxed">
                      {post.excerpt}
                    </CardDescription>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button asChild>
                      <Link href={`/blog/${post.id}`}>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-8">
                    <BookOpen className="h-24 w-24 sm:h-32 sm:w-32 text-primary/40" />
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
            Latest Articles
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts
              .filter((post) => !post.featured)
              .map((post) => (
                <Card
                  key={post.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl line-clamp-2 leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="ghost" asChild className="w-full">
                      <Link href={`/blog/${post.id}`}>
                        Read Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl sm:text-3xl">
                Stay Updated
              </CardTitle>
              <CardDescription className="text-lg">
                Get the latest articles and insights delivered to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
