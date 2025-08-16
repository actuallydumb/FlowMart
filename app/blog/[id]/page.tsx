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
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  BookOpen,
  Tag,
  MessageCircle,
  Heart,
} from "lucide-react";

import { notFound } from "next/navigation";

// Fetch blog post from database
async function getBlogPost(id: string) {
  // For now, return a fallback blog post since the database might not have content yet
  // In production, this would fetch from the database
  if (id === "1") {
    return {
      id: "1",
      title: "The Future of Workflow Automation in 2024",
      excerpt:
        "Discover the latest trends and technologies that are shaping the future of business automation.",
      content: `
        <h2>The Evolution of Automation</h2>
        <p>As we step into 2024, the landscape of workflow automation is undergoing a remarkable transformation. The convergence of artificial intelligence, machine learning, and cloud computing has created unprecedented opportunities for businesses to streamline their operations.</p>
        
        <h3>Key Trends Shaping the Future</h3>
        <p>Several key trends are driving the evolution of workflow automation:</p>
        <ul>
          <li><strong>AI-Powered Decision Making:</strong> Advanced algorithms are now capable of making complex business decisions autonomously.</li>
          <li><strong>Low-Code/No-Code Platforms:</strong> Democratization of automation tools is enabling non-technical users to create sophisticated workflows.</li>
          <li><strong>Integration Ecosystems:</strong> Seamless connectivity between different tools and platforms is becoming the norm.</li>
          <li><strong>Real-Time Analytics:</strong> Instant insights into workflow performance and optimization opportunities.</li>
        </ul>
        
        <h3>The Impact on Business Operations</h3>
        <p>These advancements are fundamentally changing how businesses operate. Companies that embrace these technologies are seeing:</p>
        <ul>
          <li>Increased productivity by 40-60%</li>
          <li>Reduced operational costs by 25-35%</li>
          <li>Improved accuracy and reduced human error</li>
          <li>Enhanced customer experience through faster response times</li>
        </ul>
        
        <h2>Looking Ahead</h2>
        <p>As we look to the future, it's clear that workflow automation will continue to evolve and become even more integral to business success. The key is to stay informed and be ready to adapt to these changes.</p>
      `,
      author: {
        name: "Alex Chen",
        image: null,
      },
      tags: ["Automation", "AI", "Productivity"],
      category: "Trends",
      readTime: "5 min read",
      publishedAt: "2024-01-15",
      image: "/blog/future-automation.jpg",
    };
  }

  // Return null for other IDs - they don't exist yet
  return null;
}

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.id);

  if (!post) {
    return {
      title: "Post Not Found - WorkflowKart Blog",
    };
  }

  return {
    title: `${post.title} - WorkflowKart Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            {/* Category and Date */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-medium">
                  {post.author?.name || "Unknown Author"}
                </div>
                <div className="text-sm text-muted-foreground">
                  WorkflowKart Team
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags &&
                post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Related Articles</h2>
            <p className="text-muted-foreground">
              Continue reading more insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Related posts would be fetched from database */}
            {/* For now, showing a placeholder */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">Automation</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />5 min read
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2">
                  More articles coming soon
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  We're working on more great content for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    WorkflowKart Team
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-3xl">Stay Updated</CardTitle>
              <CardDescription className="text-lg">
                Get the latest articles and insights delivered to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground"
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
