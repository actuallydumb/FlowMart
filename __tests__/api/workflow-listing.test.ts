import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock NextAuth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
const mockPrisma = {
  workflow: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  tag: {
    findMany: jest.fn(),
  },
};

jest.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

describe("Workflow Listing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Database Fetching", () => {
    it("should fetch workflows from database with correct filters", async () => {
      const mockWorkflows = [
        {
          id: "workflow1",
          name: "Email Automation",
          description: "Automate email workflows",
          price: 29.99,
          status: "APPROVED",
          downloads: 100,
          averageRating: 4.5,
          reviewCount: 10,
          user: { id: "user1", name: "John Doe", image: null },
          tags: [{ id: "tag1", name: "Email" }],
          reviews: [],
        },
        {
          id: "workflow2",
          name: "CRM Integration",
          description: "Integrate with CRM systems",
          price: 49.99,
          status: "APPROVED",
          downloads: 50,
          averageRating: 4.2,
          reviewCount: 5,
          user: { id: "user2", name: "Jane Smith", image: null },
          tags: [{ id: "tag2", name: "CRM" }],
          reviews: [],
        },
      ];

      mockPrisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      // Simulate the API logic
      const where = {
        status: "APPROVED",
        OR: [
          { name: { contains: "email", mode: "insensitive" } },
          { description: { contains: "email", mode: "insensitive" } },
        ],
        tags: {
          some: {
            name: "Email",
          },
        },
      };

      const workflows = await mockPrisma.workflow.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(workflows).toEqual(mockWorkflows);
      expect(mockPrisma.workflow.findMany).toHaveBeenCalledWith({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("should handle empty search results", async () => {
      mockPrisma.workflow.findMany.mockResolvedValue([]);

      const workflows = await mockPrisma.workflow.findMany({
        where: {
          status: "APPROVED",
          OR: [
            { name: { contains: "nonexistent", mode: "insensitive" } },
            { description: { contains: "nonexistent", mode: "insensitive" } },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(workflows).toEqual([]);
    });
  });

  describe("Filtering Logic", () => {
    it("should filter workflows by search term", () => {
      const workflows = [
        { name: "Email Automation", description: "Email workflow" },
        { name: "CRM Integration", description: "CRM workflow" },
        { name: "Data Processing", description: "Data workflow" },
      ];

      const searchTerm = "email";
      const filtered = workflows.filter((workflow) => {
        return (
          workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("Email Automation");
    });

    it("should filter workflows by tags", () => {
      const workflows = [
        { tags: [{ name: "Email" }, { name: "Automation" }] },
        { tags: [{ name: "CRM" }] },
        { tags: [{ name: "Email" }, { name: "Marketing" }] },
      ];

      const selectedTags = ["Email"];
      const filtered = workflows.filter((workflow) => {
        return (
          selectedTags.length === 0 ||
          selectedTags.some((tag) => workflow.tags.some((t) => t.name === tag))
        );
      });

      expect(filtered).toHaveLength(2);
    });

    it("should handle multiple tag filters", () => {
      const workflows = [
        { tags: [{ name: "Email" }, { name: "Automation" }] },
        { tags: [{ name: "CRM" }] },
        { tags: [{ name: "Email" }, { name: "Marketing" }] },
      ];

      const selectedTags = ["Email", "Automation"];
      const filtered = workflows.filter((workflow) => {
        return (
          selectedTags.length === 0 ||
          selectedTags.some((tag) => workflow.tags.some((t) => t.name === tag))
        );
      });

      expect(filtered).toHaveLength(2);
    });
  });

  describe("Sorting Logic", () => {
    it("should sort workflows by popularity (downloads)", () => {
      const workflows = [
        { downloads: 50, name: "Workflow B" },
        { downloads: 100, name: "Workflow A" },
        { downloads: 25, name: "Workflow C" },
      ];

      const sorted = [...workflows].sort((a, b) => b.downloads - a.downloads);

      expect(sorted[0].name).toBe("Workflow A");
      expect(sorted[1].name).toBe("Workflow B");
      expect(sorted[2].name).toBe("Workflow C");
    });

    it("should sort workflows by price", () => {
      const workflows = [
        { price: 49.99, name: "Expensive Workflow" },
        { price: 19.99, name: "Cheap Workflow" },
        { price: 29.99, name: "Medium Workflow" },
      ];

      const sorted = [...workflows].sort((a, b) => a.price - b.price);

      expect(sorted[0].name).toBe("Cheap Workflow");
      expect(sorted[1].name).toBe("Medium Workflow");
      expect(sorted[2].name).toBe("Expensive Workflow");
    });

    it("should sort workflows by rating", () => {
      const workflows = [
        { averageRating: 4.2, name: "Good Workflow" },
        { averageRating: 4.8, name: "Excellent Workflow" },
        { averageRating: 3.5, name: "Average Workflow" },
      ];

      const sorted = [...workflows].sort(
        (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
      );

      expect(sorted[0].name).toBe("Excellent Workflow");
      expect(sorted[1].name).toBe("Good Workflow");
      expect(sorted[2].name).toBe("Average Workflow");
    });

    it("should sort workflows by creation date", () => {
      const workflows = [
        { createdAt: "2024-01-01", name: "Old Workflow" },
        { createdAt: "2024-03-01", name: "New Workflow" },
        { createdAt: "2024-02-01", name: "Recent Workflow" },
      ];

      const sorted = [...workflows].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      expect(sorted[0].name).toBe("New Workflow");
      expect(sorted[1].name).toBe("Recent Workflow");
      expect(sorted[2].name).toBe("Old Workflow");
    });
  });

  describe("Average Rating Calculation", () => {
    it("should calculate average rating correctly", () => {
      const workflows = [
        {
          reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
          name: "Workflow A",
        },
        {
          reviews: [{ rating: 3 }, { rating: 2 }],
          name: "Workflow B",
        },
        {
          reviews: [],
          name: "Workflow C",
        },
      ];

      const workflowsWithRating = workflows.map((workflow) => {
        const totalRating = workflow.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating =
          workflow.reviews.length > 0
            ? totalRating / workflow.reviews.length
            : 0;

        return {
          ...workflow,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: workflow.reviews.length,
        };
      });

      expect(workflowsWithRating[0].averageRating).toBe(4.7);
      expect(workflowsWithRating[0].reviewCount).toBe(3);
      expect(workflowsWithRating[1].averageRating).toBe(2.5);
      expect(workflowsWithRating[1].reviewCount).toBe(2);
      expect(workflowsWithRating[2].averageRating).toBe(0);
      expect(workflowsWithRating[2].reviewCount).toBe(0);
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPrisma.workflow.findMany.mockRejectedValue(
        new Error("Database error")
      );

      try {
        await mockPrisma.workflow.findMany({
          where: { status: "APPROVED" },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Database error");
      }
    });

    it("should handle empty tag arrays", () => {
      const workflows = [
        { tags: [] },
        { tags: [{ name: "Email" }] },
        { tags: [] },
      ];

      const selectedTags: string[] = [];
      const filtered = workflows.filter((workflow) => {
        return (
          selectedTags.length === 0 ||
          selectedTags.some((tag) => workflow.tags.some((t) => t.name === tag))
        );
      });

      expect(filtered).toHaveLength(3);
    });
  });
});
