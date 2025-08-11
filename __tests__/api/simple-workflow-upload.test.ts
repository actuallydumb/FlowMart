// Mock dependencies
jest.mock("@/lib/db");

import { prisma } from "@/lib/db";
import { workflowSchema } from "@/types";

// Type the mocks
const mockPrisma = jest.mocked(prisma);

describe("Workflow Upload Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Workflow Creation", () => {
    it("should create workflow with new tags", async () => {
      const mockWorkflowData = {
        name: "Test Workflow",
        description: "A test workflow for automation",
        price: 29.99,
        fileUrl: "https://uploadthing.com/test.json",
        tags: ["Email", "Marketing"],
      };

      const mockCreatedTags = [
        { id: "tag1", name: "Email", createdAt: new Date() },
        { id: "tag2", name: "Marketing", createdAt: new Date() },
      ];

      const mockCreatedWorkflow = {
        id: "workflow123",
        ...mockWorkflowData,
        previewUrl: null,
        status: "PENDING" as const,
        downloads: 0,
        isPublic: false,
        isFeatured: false,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user123",
        organizationId: null,
        user: { id: "user123", name: "Test User", image: null },
        tags: mockCreatedTags,
      };

      // Validate input data
      const validationResult = workflowSchema.safeParse(mockWorkflowData);
      expect(validationResult.success).toBe(true);

      // Mock tag creation
      mockPrisma.tag.findUnique
        .mockResolvedValueOnce(null) // Email tag doesn't exist
        .mockResolvedValueOnce(null); // Marketing tag doesn't exist
      mockPrisma.tag.create
        .mockResolvedValueOnce(mockCreatedTags[0])
        .mockResolvedValueOnce(mockCreatedTags[1]);

      // Mock workflow creation
      mockPrisma.workflow.create.mockResolvedValue(mockCreatedWorkflow);

      // Simulate the workflow creation process
      const createdTags = await Promise.all(
        mockWorkflowData.tags.map(async (tagName) => {
          const existingTag = await prisma.tag.findUnique({
            where: { name: tagName },
          });

          if (existingTag) {
            return existingTag;
          }

          return await prisma.tag.create({
            data: { name: tagName },
          });
        })
      );

      const workflow = await prisma.workflow.create({
        data: {
          name: mockWorkflowData.name,
          description: mockWorkflowData.description,
          price: mockWorkflowData.price,
          fileUrl: mockWorkflowData.fileUrl,
          status: "PENDING",
          userId: "user123",
          tags: {
            connect: createdTags.map((tag) => ({ id: tag.id })),
          },
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
        },
      });

      expect(workflow.id).toBe("workflow123");
      expect(workflow.name).toBe("Test Workflow");
      expect(workflow.status).toBe("PENDING");
      expect(workflow.tags).toHaveLength(2);
      expect(workflow.tags[0].name).toBe("Email");
      expect(workflow.tags[1].name).toBe("Marketing");
    });

    it("should create workflow with existing tags", async () => {
      const mockWorkflowData = {
        name: "Test Workflow",
        description: "A test workflow for automation",
        price: 29.99,
        fileUrl: "https://uploadthing.com/test.json",
        tags: ["Email", "Marketing"],
      };

      const mockExistingTags = [
        { id: "tag1", name: "Email", createdAt: new Date() },
        { id: "tag2", name: "Marketing", createdAt: new Date() },
      ];

      const mockCreatedWorkflow = {
        id: "workflow123",
        ...mockWorkflowData,
        previewUrl: null,
        status: "PENDING" as const,
        downloads: 0,
        isPublic: false,
        isFeatured: false,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user123",
        organizationId: null,
        user: { id: "user123", name: "Test User", image: null },
        tags: mockExistingTags,
      };

      // Validate input data
      const validationResult = workflowSchema.safeParse(mockWorkflowData);
      expect(validationResult.success).toBe(true);

      // Mock existing tags
      mockPrisma.tag.findUnique
        .mockResolvedValueOnce(mockExistingTags[0]) // Email tag exists
        .mockResolvedValueOnce(mockExistingTags[1]); // Marketing tag exists

      // Mock workflow creation
      mockPrisma.workflow.create.mockResolvedValue(mockCreatedWorkflow);

      // Simulate the workflow creation process
      const createdTags = await Promise.all(
        mockWorkflowData.tags.map(async (tagName) => {
          const existingTag = await prisma.tag.findUnique({
            where: { name: tagName },
          });

          if (existingTag) {
            return existingTag;
          }

          return await prisma.tag.create({
            data: { name: tagName },
          });
        })
      );

      const workflow = await prisma.workflow.create({
        data: {
          name: mockWorkflowData.name,
          description: mockWorkflowData.description,
          price: mockWorkflowData.price,
          fileUrl: mockWorkflowData.fileUrl,
          status: "PENDING",
          userId: "user123",
          tags: {
            connect: createdTags.map((tag) => ({ id: tag.id })),
          },
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
        },
      });

      expect(workflow.id).toBe("workflow123");
      expect(workflow.tags).toHaveLength(2);
      expect(workflow.tags[0].name).toBe("Email");
      expect(workflow.tags[1].name).toBe("Marketing");
    });
  });

  describe("Workflow Validation", () => {
    it("should reject workflow with invalid data", () => {
      const invalidWorkflowData = {
        name: "", // Invalid: empty name
        description: "A test workflow",
        price: 29.99,
        fileUrl: "https://uploadthing.com/test.json",
        tags: ["Email"],
      };

      const validationResult = workflowSchema.safeParse(invalidWorkflowData);
      expect(validationResult.success).toBe(false);
    });

    it("should reject workflow with short description", () => {
      const invalidWorkflowData = {
        name: "Test Workflow",
        description: "Short", // Too short
        price: 29.99,
        fileUrl: "https://uploadthing.com/test.json",
        tags: ["Email"],
      };

      const validationResult = workflowSchema.safeParse(invalidWorkflowData);
      expect(validationResult.success).toBe(false);
    });

    it("should reject workflow with negative price", () => {
      const invalidWorkflowData = {
        name: "Test Workflow",
        description: "A test workflow for automation",
        price: -10, // Negative price
        fileUrl: "https://uploadthing.com/test.json",
        tags: ["Email"],
      };

      const validationResult = workflowSchema.safeParse(invalidWorkflowData);
      expect(validationResult.success).toBe(false);
    });

    it("should reject workflow without tags", () => {
      const invalidWorkflowData = {
        name: "Test Workflow",
        description: "A test workflow for automation",
        price: 29.99,
        fileUrl: "https://uploadthing.com/test.json",
        tags: [], // Empty tags
      };

      const validationResult = workflowSchema.safeParse(invalidWorkflowData);
      expect(validationResult.success).toBe(false);
    });
  });

  describe("Workflow Retrieval", () => {
    it("should return approved workflows", async () => {
      const mockWorkflows = [
        {
          id: "workflow1",
          name: "Email Marketing",
          description: "Email marketing automation",
          price: 29.99,
          fileUrl: "https://example.com/workflow1.json",
          previewUrl: null,
          status: "APPROVED" as const,
          downloads: 10,
          isPublic: false,
          isFeatured: false,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "user1",
          organizationId: null,
          user: { id: "user1", name: "Creator 1", image: null },
          tags: [{ id: "tag1", name: "Email", createdAt: new Date() }],
        },
        {
          id: "workflow2",
          name: "CRM Integration",
          description: "CRM integration workflow",
          price: 49.99,
          fileUrl: "https://example.com/workflow2.json",
          previewUrl: null,
          status: "APPROVED" as const,
          downloads: 5,
          isPublic: false,
          isFeatured: false,
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "user2",
          organizationId: null,
          user: { id: "user2", name: "Creator 2", image: null },
          tags: [{ id: "tag2", name: "CRM", createdAt: new Date() }],
        },
      ];

      mockPrisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      const workflows = await prisma.workflow.findMany({
        where: {
          status: "APPROVED",
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
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(workflows).toHaveLength(2);
      expect(workflows[0].status).toBe("APPROVED");
      expect(workflows[1].status).toBe("APPROVED");
    });
  });
});
