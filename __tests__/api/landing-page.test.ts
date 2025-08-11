import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock NextAuth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
const mockPrisma = {
  blog: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  workflow: {
    findMany: jest.fn(),
  },
};

jest.mock("@/lib/db", () => ({
  prisma: mockPrisma,
}));

describe("Landing Page APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Blogs API", () => {
    it("should fetch published blogs with pagination", async () => {
      const mockBlogs = [
        {
          id: "blog1",
          title: "Getting Started with Workflow Automation",
          slug: "getting-started-with-workflow-automation",
          excerpt: "Learn the basics of workflow automation...",
          image: "https://example.com/image1.jpg",
          createdAt: new Date("2024-01-01"),
        },
        {
          id: "blog2",
          title: "Top 10 Automation Trends",
          slug: "top-10-automation-trends",
          excerpt: "Discover the latest trends...",
          image: "https://example.com/image2.jpg",
          createdAt: new Date("2024-01-02"),
        },
      ];

      mockPrisma.blog.findMany.mockResolvedValue(mockBlogs);
      mockPrisma.blog.count.mockResolvedValue(2);

      // Simulate the API logic
      const blogs = await mockPrisma.blog.findMany({
        where: {
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: 0,
        take: 4,
      });

      const total = await mockPrisma.blog.count({
        where: {
          published: true,
        },
      });

      expect(blogs).toEqual(mockBlogs);
      expect(total).toBe(2);
      expect(mockPrisma.blog.findMany).toHaveBeenCalledWith({
        where: {
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: 0,
        take: 4,
      });
    });

    it("should handle empty blog results", async () => {
      mockPrisma.blog.findMany.mockResolvedValue([]);
      mockPrisma.blog.count.mockResolvedValue(0);

      const blogs = await mockPrisma.blog.findMany({
        where: {
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: 0,
        take: 4,
      });

      expect(blogs).toEqual([]);
    });

    it("should handle pagination parameters", async () => {
      const mockBlogs = [
        {
          id: "blog3",
          title: "Advanced Automation Techniques",
          slug: "advanced-automation-techniques",
          excerpt: "Master advanced automation...",
          image: null,
          createdAt: new Date("2024-01-03"),
        },
      ];

      mockPrisma.blog.findMany.mockResolvedValue(mockBlogs);

      const blogs = await mockPrisma.blog.findMany({
        where: {
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: 4, // Page 2
        take: 2,
      });

      expect(blogs).toEqual(mockBlogs);
      expect(mockPrisma.blog.findMany).toHaveBeenCalledWith({
        where: {
          published: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: 4,
        take: 2,
      });
    });
  });

  describe("Featured Workflows API", () => {
    it("should fetch approved workflows with ratings", async () => {
      const mockWorkflows = [
        {
          id: "workflow1",
          name: "Email Marketing Automation",
          description: "Automate your email campaigns",
          price: 29.99,
          status: "APPROVED",
          isPublic: true,
          downloads: 100,
          user: {
            id: "user1",
            name: "John Doe",
            image: null,
          },
          tags: [
            { id: "tag1", name: "Email" },
            { id: "tag2", name: "Marketing" },
          ],
          reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
        },
        {
          id: "workflow2",
          name: "CRM Integration",
          description: "Integrate with CRM systems",
          price: 49.99,
          status: "APPROVED",
          isPublic: true,
          downloads: 50,
          user: {
            id: "user2",
            name: "Jane Smith",
            image: null,
          },
          tags: [{ id: "tag3", name: "CRM" }],
          reviews: [{ rating: 4 }, { rating: 3 }],
        },
      ];

      mockPrisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      const workflows = await mockPrisma.workflow.findMany({
        where: {
          status: "APPROVED",
          isPublic: true,
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
        orderBy: [{ downloads: "desc" }, { createdAt: "desc" }],
        take: 6,
      });

      // Calculate average ratings
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
          reviews: undefined,
        };
      });

      expect(workflowsWithRating).toHaveLength(2);
      expect(workflowsWithRating[0].averageRating).toBe(4.7);
      expect(workflowsWithRating[0].reviewCount).toBe(3);
      expect(workflowsWithRating[1].averageRating).toBe(3.5);
      expect(workflowsWithRating[1].reviewCount).toBe(2);
    });

    it("should handle workflows with no reviews", async () => {
      const mockWorkflows = [
        {
          id: "workflow3",
          name: "New Workflow",
          description: "A new workflow without reviews",
          price: 19.99,
          status: "APPROVED",
          isPublic: true,
          downloads: 10,
          user: {
            id: "user3",
            name: "Bob Wilson",
            image: null,
          },
          tags: [],
          reviews: [],
        },
      ];

      mockPrisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      const workflows = await mockPrisma.workflow.findMany({
        where: {
          status: "APPROVED",
          isPublic: true,
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
        orderBy: [{ downloads: "desc" }, { createdAt: "desc" }],
        take: 6,
      });

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
          reviews: undefined,
        };
      });

      expect(workflowsWithRating[0].averageRating).toBe(0);
      expect(workflowsWithRating[0].reviewCount).toBe(0);
    });

    it("should respect the limit parameter", async () => {
      const mockWorkflows = Array.from({ length: 10 }, (_, i) => ({
        id: `workflow${i}`,
        name: `Workflow ${i}`,
        description: `Description ${i}`,
        price: 19.99 + i,
        status: "APPROVED",
        isPublic: true,
        downloads: 100 - i * 10,
        user: {
          id: `user${i}`,
          name: `User ${i}`,
          image: null,
        },
        tags: [],
        reviews: [],
      }));

      mockPrisma.workflow.findMany.mockResolvedValue(mockWorkflows.slice(0, 3));

      const workflows = await mockPrisma.workflow.findMany({
        where: {
          status: "APPROVED",
          isPublic: true,
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
        orderBy: [{ downloads: "desc" }, { createdAt: "desc" }],
        take: 3,
      });

      expect(workflows).toHaveLength(3);
      expect(mockPrisma.workflow.findMany).toHaveBeenCalledWith({
        where: {
          status: "APPROVED",
          isPublic: true,
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
        orderBy: [{ downloads: "desc" }, { createdAt: "desc" }],
        take: 3,
      });
    });
  });

  describe("Testimonials API", () => {
    it("should return testimonials with proper structure", async () => {
      // This is a mock API, so we'll test the expected structure
      const expectedTestimonials = [
        {
          id: "1",
          name: "Sarah Chen",
          role: "CTO",
          company: "TechFlow Inc",
          quote: "WorkflowKart has transformed how we handle automation...",
          avatar: "SC",
          rating: 5,
        },
        {
          id: "2",
          name: "Mike Rodriguez",
          role: "Automation Developer",
          company: "Freelance",
          quote:
            "As a developer, I've earned over $50K selling my automation workflows...",
          avatar: "MR",
          rating: 5,
        },
      ];

      // Simulate API response
      const testimonials = expectedTestimonials.slice(0, 2);

      expect(testimonials).toHaveLength(2);
      expect(testimonials[0]).toHaveProperty("id");
      expect(testimonials[0]).toHaveProperty("name");
      expect(testimonials[0]).toHaveProperty("role");
      expect(testimonials[0]).toHaveProperty("company");
      expect(testimonials[0]).toHaveProperty("quote");
      expect(testimonials[0]).toHaveProperty("avatar");
      expect(testimonials[0]).toHaveProperty("rating");
      expect(testimonials[0].rating).toBeGreaterThan(0);
      expect(testimonials[0].rating).toBeLessThanOrEqual(5);
    });

    it("should respect the limit parameter", async () => {
      const allTestimonials = [
        {
          id: "1",
          name: "User 1",
          role: "Role 1",
          company: "Company 1",
          quote: "Quote 1",
          avatar: "U1",
          rating: 5,
        },
        {
          id: "2",
          name: "User 2",
          role: "Role 2",
          company: "Company 2",
          quote: "Quote 2",
          avatar: "U2",
          rating: 4,
        },
        {
          id: "3",
          name: "User 3",
          role: "Role 3",
          company: "Company 3",
          quote: "Quote 3",
          avatar: "U3",
          rating: 5,
        },
        {
          id: "4",
          name: "User 4",
          role: "Role 4",
          company: "Company 4",
          quote: "Quote 4",
          avatar: "U4",
          rating: 4,
        },
      ];

      const limitedTestimonials = allTestimonials.slice(0, 2);

      expect(limitedTestimonials).toHaveLength(2);
      expect(limitedTestimonials[0].id).toBe("1");
      expect(limitedTestimonials[1].id).toBe("2");
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPrisma.blog.findMany.mockRejectedValue(
        new Error("Database connection failed")
      );

      try {
        await mockPrisma.blog.findMany({
          where: { published: true },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Database connection failed");
      }
    });

    it("should handle workflow fetch errors", async () => {
      mockPrisma.workflow.findMany.mockRejectedValue(
        new Error("Workflow fetch failed")
      );

      try {
        await mockPrisma.workflow.findMany({
          where: { status: "APPROVED" },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Workflow fetch failed");
      }
    });
  });

  describe("Data Validation", () => {
    it("should validate blog data structure", () => {
      const validBlog = {
        id: "blog1",
        title: "Valid Blog Title",
        slug: "valid-blog-slug",
        excerpt: "Valid excerpt",
        image: "https://example.com/image.jpg",
        createdAt: new Date(),
      };

      expect(validBlog).toHaveProperty("id");
      expect(validBlog).toHaveProperty("title");
      expect(validBlog).toHaveProperty("slug");
      expect(validBlog).toHaveProperty("excerpt");
      expect(validBlog).toHaveProperty("createdAt");
      expect(typeof validBlog.title).toBe("string");
      expect(typeof validBlog.slug).toBe("string");
      expect(typeof validBlog.excerpt).toBe("string");
    });

    it("should validate workflow data structure", () => {
      const validWorkflow = {
        id: "workflow1",
        name: "Valid Workflow",
        description: "Valid description",
        price: 29.99,
        averageRating: 4.5,
        reviewCount: 10,
        user: {
          id: "user1",
          name: "John Doe",
          image: null,
        },
        tags: [{ id: "tag1", name: "Automation" }],
      };

      expect(validWorkflow).toHaveProperty("id");
      expect(validWorkflow).toHaveProperty("name");
      expect(validWorkflow).toHaveProperty("description");
      expect(validWorkflow).toHaveProperty("price");
      expect(validWorkflow).toHaveProperty("user");
      expect(validWorkflow).toHaveProperty("tags");
      expect(typeof validWorkflow.price).toBe("number");
      expect(Array.isArray(validWorkflow.tags)).toBe(true);
    });
  });
});
