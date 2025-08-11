import { workflowSchema, purchaseSchema, reviewSchema } from "@/types";

describe("Workflow Schema", () => {
  it("should validate a valid workflow", () => {
    const validWorkflow = {
      name: "Test Workflow",
      description: "A test workflow for automation",
      price: 29.99,
      fileUrl: "https://uploadthing.com/test.json",
      tags: ["Email", "Marketing"],
    };

    const result = workflowSchema.safeParse(validWorkflow);
    expect(result.success).toBe(true);
  });

  it("should reject workflow without name", () => {
    const invalidWorkflow = {
      description: "A test workflow for automation",
      price: 29.99,
      fileUrl: "https://uploadthing.com/test.json",
      tags: ["Email"],
    };

    const result = workflowSchema.safeParse(invalidWorkflow);
    expect(result.success).toBe(false);
  });

  it("should reject workflow without description", () => {
    const invalidWorkflow = {
      name: "Test Workflow",
      price: 29.99,
      fileUrl: "https://uploadthing.com/test.json",
      tags: ["Email"],
    };

    const result = workflowSchema.safeParse(invalidWorkflow);
    expect(result.success).toBe(false);
  });

  it("should reject workflow with negative price", () => {
    const invalidWorkflow = {
      name: "Test Workflow",
      description: "A test workflow for automation",
      price: -10,
      fileUrl: "https://uploadthing.com/test.json",
      tags: ["Email"],
    };

    const result = workflowSchema.safeParse(invalidWorkflow);
    expect(result.success).toBe(false);
  });

  it("should reject workflow without tags", () => {
    const invalidWorkflow = {
      name: "Test Workflow",
      description: "A test workflow for automation",
      price: 29.99,
      fileUrl: "https://uploadthing.com/test.json",
      tags: [],
    };

    const result = workflowSchema.safeParse(invalidWorkflow);
    expect(result.success).toBe(false);
  });
});

describe("Purchase Schema", () => {
  it("should validate a valid purchase", () => {
    const validPurchase = {
      workflowId: "workflow123",
      amount: 29.99,
    };

    const result = purchaseSchema.safeParse(validPurchase);
    expect(result.success).toBe(true);
  });

  it("should reject purchase with negative amount", () => {
    const invalidPurchase = {
      workflowId: "workflow123",
      amount: -10,
    };

    const result = purchaseSchema.safeParse(invalidPurchase);
    expect(result.success).toBe(false);
  });
});

describe("Review Schema", () => {
  it("should validate a valid review", () => {
    const validReview = {
      workflowId: "workflow123",
      rating: 5,
      reviewText: "Great workflow!",
    };

    const result = reviewSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("should validate review without reviewText", () => {
    const validReview = {
      workflowId: "workflow123",
      rating: 4,
    };

    const result = reviewSchema.safeParse(validReview);
    expect(result.success).toBe(true);
  });

  it("should reject review with invalid rating", () => {
    const invalidReview = {
      workflowId: "workflow123",
      rating: 6,
      reviewText: "Great workflow!",
    };

    const result = reviewSchema.safeParse(invalidReview);
    expect(result.success).toBe(false);
  });

  it("should reject review with rating below 1", () => {
    const invalidReview = {
      workflowId: "workflow123",
      rating: 0,
      reviewText: "Great workflow!",
    };

    const result = reviewSchema.safeParse(invalidReview);
    expect(result.success).toBe(false);
  });
});
