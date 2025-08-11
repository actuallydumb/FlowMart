"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  Package,
  Zap,
  ShoppingCart,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { WorkflowWithUser } from "@/types";
import { toast } from "sonner";

interface Tag {
  id: string;
  name: string;
  workflowCount: number;
}

export default function MarketplacePage() {
  const { data: session } = useSession();
  const [workflows, setWorkflows] = useState<WorkflowWithUser[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "popular" | "price" | "newest" | "rating"
  >("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workflowsRes, tagsRes] = await Promise.all([
        fetchWorkflows(),
        fetchTags(),
      ]);

      if (workflowsRes) {
        setWorkflows(workflowsRes);
      }

      if (tagsRes) {
        setAvailableTags(tagsRes);
      }
    } catch (error) {
      console.error("Error fetching marketplace data:", error);
      toast.error("Failed to load marketplace data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkflows = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedTags.length > 0) {
        selectedTags.forEach((tag) => params.append("tag", tag));
      }

      const response = await fetch(`/api/workflows?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        toast.error("Failed to fetch workflows");
        return null;
      }
    } catch (error) {
      console.error("Error fetching workflows:", error);
      toast.error("Failed to fetch workflows");
      return null;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        return data.tags;
      } else {
        toast.error("Failed to fetch tags");
        return null;
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to fetch tags");
      return null;
    }
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => workflow.tags.some((t) => t.name === tag));
    return matchesSearch && matchesTags;
  });

  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.downloads - a.downloads;
      case "price":
        return a.price - b.price;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "rating":
        return (b.averageRating || 0) - (a.averageRating || 0);
      default:
        return 0;
    }
  });

  const handlePurchase = async (workflowId: string) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflowId }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session");
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSortBy("popular");
  };

  const hasActiveFilters =
    searchTerm || selectedTags.length > 0 || sortBy !== "popular";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Package className="h-8 w-8 text-primary mr-3" />
              Workflow Marketplace
            </h1>
            <p className="text-muted-foreground">
              Discover and purchase powerful automation workflows
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {workflows.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Workflows</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {
                workflows.filter((w) => w.averageRating && w.averageRating >= 4)
                  .length
              }
            </div>
            <div className="text-sm text-muted-foreground">Highly Rated</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {availableTags.length}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {workflows.filter((w) => w.isFeatured).length}
            </div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">
              <TrendingUp className="h-4 w-4 mr-2" />
              Most Popular
            </SelectItem>
            <SelectItem value="rating">
              <Star className="h-4 w-4 mr-2" />
              Highest Rated
            </SelectItem>
            <SelectItem value="price">
              <DollarSign className="h-4 w-4 mr-2" />
              Price: Low to High
            </SelectItem>
            <SelectItem value="newest">
              <Calendar className="h-4 w-4 mr-2" />
              Newest First
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Filter className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag.id}
                variant={
                  selectedTags.includes(tag.name) ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toggleTag(tag.name)}
              >
                {tag.name} ({tag.workflowCount})
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {sortedWorkflows.length} workflow
            {sortedWorkflows.length !== 1 ? "s" : ""} found
          </span>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
        {hasActiveFilters && <Badge variant="secondary">Filters Active</Badge>}
      </div>

      {/* Workflows Grid */}
      {sortedWorkflows.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {sortedWorkflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {workflow.name}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {workflow.description}
                    </CardDescription>
                  </div>
                  {workflow.isFeatured && (
                    <Badge className="bg-yellow-500 text-yellow-900">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {workflow.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      {workflow.averageRating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{workflow.averageRating}</span>
                          <span className="ml-1">({workflow.reviewCount})</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        <span>{workflow.downloads} downloads</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${workflow.price}
                      </div>
                      <div className="text-xs">by {workflow.user.name}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      onClick={() => handlePurchase(workflow.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={`/workflow/${workflow.id}`}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Workflows Found</h3>
              <p className="text-muted-foreground mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search or filter criteria."
                  : "No workflows are available at the moment."}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters}>Clear All Filters</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
