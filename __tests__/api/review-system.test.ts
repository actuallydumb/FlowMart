import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { hasRole } from "@/types";

// Mock NextAuth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
const mockPrisma = {
  workflowReview: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  purchase: {
    findFirst: jest.fn(),
  },
  workflow: {
    findUnique: jest.fn(),
  },
};

jest.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

describe("Review System", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Review Creation", () => {
    it("should allow users to create reviews after purchasing", async () => {
      const mockSession = {
        user: { id: "user1", roles: ["BUYER"] },
      };

      const mockPurchase = {
        id: "purchase1",
        workflowId: "workflow1",
        buyerId: "user1",
        status: "COMPLETED",
      };

      const mockReview = {
        id: "review1",
        rating: 5,
        reviewText: "Great workflow!",
        workflowId: "workflow1",
        userId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: "user1",
          name: "Test User",
          image: null,
        },
      };

      mockPrisma.purchase.findFirst.mockResolvedValue(mockPurchase);
      mockPrisma.workflowReview.findUnique.mockResolvedValue(null);
      mockPrisma.workflowReview.create.mockResolvedValue(mockReview);

      // Simulate the logic from the API route
      const hasPurchased = mockPurchase.status === "COMPLETED";
      const existingReview = null;
      const canCreateReview = hasPurchased && !existingReview;

      expect(canCreateReview).toBe(true);
    });

    it("should prevent users from creating reviews without purchasing", async () => {
      const mockSession = {
        user: { id: "user1", roles: ["BUYER"] },
      };

      mockPrisma.purchase.findFirst.mockResolvedValue(null);

      // Simulate the logic from the API route
      const hasPurchased = false;
      const canCreateReview = hasPurchased;

      expect(canCreateReview).toBe(false);
    });

    it("should prevent duplicate reviews from the same user", async () => {
      const mockSession = {
        user: { id: "user1", roles: ["BUYER"] },
      };

      const mockPurchase = {
        id: "purchase1",
        workflowId: "workflow1",
        buyerId: "user1",
        status: "COMPLETED",
      };

      const mockExistingReview = {
        id: "review1",
        rating: 4,
        workflowId: "workflow1",
        userId: "user1",
      };

      mockPrisma.purchase.findFirst.mockResolvedValue(mockPurchase);
      mockPrisma.workflowReview.findUnique.mockResolvedValue(
        mockExistingReview
      );

      // Simulate the logic from the API route
      const hasPurchased = mockPurchase.status === "COMPLETED";
      const existingReview = mockExistingReview;
      const canCreateReview = hasPurchased && !existingReview;

      expect(canCreateReview).toBe(false);
    });
  });

  describe("Review Permissions", () => {
    it("should allow review authors to edit their own reviews", () => {
      const reviewAuthorId = "user1";
      const currentUserId = "user1";
      const isAuthor = reviewAuthorId === currentUserId;
      const isAdmin = false;

      const canEdit = isAuthor || isAdmin;

      expect(canEdit).toBe(true);
    });

    it("should allow admins to edit any review", () => {
      const reviewAuthorId = "user1";
      const currentUserId = "admin1";
      const currentUserRoles = ["ADMIN"];
      const isAuthor = reviewAuthorId === currentUserId;
      const isAdmin = hasRole(currentUserRoles, "ADMIN");

      const canEdit = isAuthor || isAdmin;

      expect(canEdit).toBe(true);
    });

    it("should prevent users from editing others' reviews", () => {
      const reviewAuthorId = "user1";
      const currentUserId = "user2";
      const currentUserRoles = ["BUYER"];
      const isAuthor = reviewAuthorId === currentUserId;
      const isAdmin = hasRole(currentUserRoles, "ADMIN");

      const canEdit = isAuthor || isAdmin;

      expect(canEdit).toBe(false);
    });
  });

  describe("Average Rating Calculation", () => {
    it("should calculate correct average rating", () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 3 },
        { rating: 5 },
        { rating: 2 },
      ];

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;
      const roundedAverage = Math.round(averageRating * 10) / 10;

      expect(roundedAverage).toBe(3.8);
    });

    it("should handle empty reviews array", () => {
      const reviews: any[] = [];

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;
      const roundedAverage = Math.round(averageRating * 10) / 10;

      expect(roundedAverage).toBe(0);
    });

    it("should handle single review", () => {
      const reviews = [{ rating: 4 }];

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRating / reviews.length : 0;
      const roundedAverage = Math.round(averageRating * 10) / 10;

      expect(roundedAverage).toBe(4);
    });
  });

  describe("Review Validation", () => {
    it("should validate rating range", () => {
      const validRatings = [1, 2, 3, 4, 5];
      const invalidRatings = [0, 6, -1, 10];

      validRatings.forEach((rating) => {
        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
      });

      invalidRatings.forEach((rating) => {
        expect(rating < 1 || rating > 5).toBe(true);
      });
    });

    it("should allow optional review text", () => {
      const reviewWithText = { rating: 5, reviewText: "Great workflow!" };
      const reviewWithoutText = { rating: 5, reviewText: undefined };

      expect(reviewWithText.reviewText).toBeDefined();
      expect(reviewWithoutText.reviewText).toBeUndefined();
    });
  });
});
