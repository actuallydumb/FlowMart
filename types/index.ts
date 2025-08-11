import { z } from "zod";

export const workflowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be non-negative"),
  fileUrl: z.string().url("File URL is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  isPublic: z.boolean().optional(),
  organizationId: z.string().optional(),
  prerequisites: z.string().optional(),
  documentation: z.string().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional(),
});

export const reviewSchema = z.object({
  workflowId: z.string(),
  rating: z.number().min(1).max(5),
  reviewText: z.string().optional(),
});

export const purchaseSchema = z.object({
  workflowId: z.string(),
  amount: z.number().positive(),
});

export const adminReviewSchema = z.object({
  workflowId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
});

export const workflowVersionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  changelog: z.string().optional(),
});

export const workflowExecutionSchema = z.object({
  workflowId: z.string(),
  input: z.record(z.any()).optional(),
});

export const organizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  logo: z.string().optional(),
});

// Database Types
export type UserRole = "ADMIN" | "DEVELOPER" | "BUYER";
export type UserRoles = UserRole[];
export type WorkflowStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PurchaseStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type EarningsStatus = "PENDING" | "PAID" | "FAILED";
export type ReviewStatus = "APPROVED" | "REJECTED";
export type ExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

// Role utility types
export type RoleCheck = (roles: UserRoles) => boolean;
export type RoleRequirement = UserRole | UserRoles;

// Role checking utilities
export const hasRole = (roles: UserRoles, requiredRole: UserRole): boolean => {
  return roles.includes(requiredRole);
};

export const hasAnyRole = (
  roles: UserRoles,
  requiredRoles: UserRoles
): boolean => {
  return requiredRoles.some((role) => roles.includes(role));
};

export const hasAllRoles = (
  roles: UserRoles,
  requiredRoles: UserRoles
): boolean => {
  return requiredRoles.every((role) => roles.includes(role));
};

export const isAdmin = (roles: UserRoles): boolean => hasRole(roles, "ADMIN");
export const isDeveloper = (roles: UserRoles): boolean =>
  hasRole(roles, "DEVELOPER");
export const isBuyer = (roles: UserRoles): boolean => hasRole(roles, "BUYER");

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WorkflowReview {
  id: string;
  rating: number;
  reviewText?: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface WorkflowWithUser {
  id: string;
  name: string;
  description: string;
  price: number;
  fileUrl: string;
  previewUrl?: string;
  prerequisites?: string;
  documentation?: string;
  mediaUrls: string[];
  videoUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  downloads: number;
  isPublic: boolean;
  isFeatured: boolean;
  version: number;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  reviews?: WorkflowReview[];
  averageRating?: number;
  reviewCount?: number;
}

export interface PurchaseWithWorkflow {
  id: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: Date;
  workflow: {
    id: string;
    name: string;
    description: string;
    fileUrl: string;
  };
}

export interface WorkflowVersion {
  id: string;
  version: number;
  name: string;
  description: string;
  fileUrl: string;
  changelog?: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface WorkflowExecution {
  id: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  result?: any;
  workflow: {
    id: string;
    name: string;
  };
  executedBy: {
    id: string;
    name: string;
  };
}

export interface WorkflowLog {
  id: string;
  level: LogLevel;
  message: string;
  metadata?: any;
  timestamp: Date;
  workflow: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
  users: Array<{
    id: string;
    name: string;
    role: UserRole;
  }>;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  fileUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RateLimit {
  id: string;
  organizationId: string;
  endpoint: string;
  limit: number;
  window: number;
  createdAt: Date;
  updatedAt: Date;
}
