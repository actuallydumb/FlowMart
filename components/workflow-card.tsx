"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Star } from "lucide-react";
import { WorkflowWithUser } from "@/types";

interface WorkflowCardProps {
  workflow: WorkflowWithUser;
  isOwner?: boolean;
  onPurchase?: (workflowId: string) => void;
}

export function WorkflowCard({
  workflow,
  isOwner = false,
  onPurchase,
}: WorkflowCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{workflow.name}</CardTitle>
            <CardDescription className="line-clamp-2 mb-3">
              {workflow.description}
            </CardDescription>
          </div>
          {workflow.averageRating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">
                {workflow.averageRating.toFixed(1)}
              </span>
              {workflow.reviewCount && (
                <span className="text-xs text-muted-foreground">
                  ({workflow.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={workflow.user.image || ""} />
            <AvatarFallback className="text-xs">
              {workflow.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {workflow.user.name}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {workflow.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{workflow.downloads} downloads</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            ${workflow.price}
          </div>
        </div>

        <div className="flex space-x-2">
          {isOwner ? (
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/workflow/${workflow.id}`}>
                <Download className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={() => onPurchase?.(workflow.id)}
            >
              Purchase
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
