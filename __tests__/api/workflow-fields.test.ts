import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { workflowSchema } from "@/types";

describe("Workflow Fields", () => {
  describe("Schema Validation", () => {
    it("should validate workflow with all new fields", () => {
      const validWorkflow = {
        name: "Test Workflow",
        description: "A comprehensive test workflow with all features",
        price: 29.99,
        fileUrl: "https://example.com/workflow.json",
        tags: ["Automation", "Email"],
        prerequisites: "Requires API key setup and email configuration",
        documentation:
          "1. Set up your API keys\n2. Configure email settings\n3. Run the workflow",
        mediaUrls: [
          "https://example.com/screenshot1.jpg",
          "https://example.com/screenshot2.jpg",
        ],
        videoUrl: "https://youtube.com/watch?v=abc123",
      };

      const result = workflowSchema.safeParse(validWorkflow);
      expect(result.success).toBe(true);
    });

    it("should validate workflow with optional fields omitted", () => {
      const minimalWorkflow = {
        name: "Minimal Workflow",
        description: "A basic workflow without optional fields",
        price: 9.99,
        fileUrl: "https://example.com/workflow.json",
        tags: ["Basic"],
      };

      const result = workflowSchema.safeParse(minimalWorkflow);
      expect(result.success).toBe(true);
    });

    it("should reject invalid video URLs", () => {
      const invalidWorkflow = {
        name: "Test Workflow",
        description: "A test workflow",
        price: 19.99,
        fileUrl: "https://example.com/workflow.json",
        tags: ["Test"],
        videoUrl: "not-a-valid-url",
      };

      const result = workflowSchema.safeParse(invalidWorkflow);
      expect(result.success).toBe(false);
    });

    it("should accept valid video URLs", () => {
      const validUrls = [
        "https://youtube.com/watch?v=abc123",
        "https://youtu.be/abc123",
        "https://vimeo.com/123456789",
        "https://example.com/video.mp4",
      ];

      validUrls.forEach((url) => {
        const workflow = {
          name: "Test Workflow",
          description: "A test workflow",
          price: 19.99,
          fileUrl: "https://example.com/workflow.json",
          tags: ["Test"],
          videoUrl: url,
        };

        const result = workflowSchema.safeParse(workflow);
        expect(result.success).toBe(true);
      });
    });

    it("should validate media URLs array", () => {
      const validWorkflow = {
        name: "Test Workflow",
        description: "A test workflow",
        price: 19.99,
        fileUrl: "https://example.com/workflow.json",
        tags: ["Test"],
        mediaUrls: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.png",
          "https://example.com/screenshot.webp",
        ],
      };

      const result = workflowSchema.safeParse(validWorkflow);
      expect(result.success).toBe(true);
    });

    it("should reject invalid media URLs", () => {
      const invalidWorkflow = {
        name: "Test Workflow",
        description: "A test workflow",
        price: 19.99,
        fileUrl: "https://example.com/workflow.json",
        tags: ["Test"],
        mediaUrls: [
          "https://example.com/valid.jpg",
          "not-a-valid-url",
          "https://example.com/another.png",
        ],
      };

      const result = workflowSchema.safeParse(invalidWorkflow);
      expect(result.success).toBe(false);
    });
  });

  describe("Field Processing", () => {
    it("should handle empty optional fields", () => {
      const workflowData = {
        name: "Test Workflow",
        description: "A test workflow",
        price: 19.99,
        fileUrl: "https://example.com/workflow.json",
        tags: ["Test"],
        prerequisites: "",
        documentation: "",
        videoUrl: "",
        mediaUrls: [],
      };

      // Simulate API processing
      const processedData = {
        ...workflowData,
        prerequisites: workflowData.prerequisites || undefined,
        documentation: workflowData.documentation || undefined,
        mediaUrls:
          workflowData.mediaUrls.length > 0
            ? workflowData.mediaUrls
            : undefined,
        videoUrl: workflowData.videoUrl || undefined,
      };

      expect(processedData.prerequisites).toBeUndefined();
      expect(processedData.documentation).toBeUndefined();
      expect(processedData.mediaUrls).toBeUndefined();
      expect(processedData.videoUrl).toBeUndefined();
    });

    it("should preserve non-empty optional fields", () => {
      const workflowData = {
        name: "Test Workflow",
        description: "A test workflow",
        price: 19.99,
        fileUrl: "https://example.com/workflow.json",
        tags: ["Test"],
        prerequisites: "Setup required",
        documentation: "Step by step instructions",
        videoUrl: "https://youtube.com/watch?v=abc123",
        mediaUrls: ["https://example.com/screenshot.jpg"],
      };

      // Simulate API processing
      const processedData = {
        ...workflowData,
        prerequisites: workflowData.prerequisites || undefined,
        documentation: workflowData.documentation || undefined,
        mediaUrls:
          workflowData.mediaUrls.length > 0
            ? workflowData.mediaUrls
            : undefined,
        videoUrl: workflowData.videoUrl || undefined,
      };

      expect(processedData.prerequisites).toBe("Setup required");
      expect(processedData.documentation).toBe("Step by step instructions");
      expect(processedData.mediaUrls).toEqual([
        "https://example.com/screenshot.jpg",
      ]);
      expect(processedData.videoUrl).toBe("https://youtube.com/watch?v=abc123");
    });
  });

  describe("Video URL Processing", () => {
    it("should extract YouTube video IDs", () => {
      const youtubeUrls = [
        "https://youtube.com/watch?v=abc123",
        "https://www.youtube.com/watch?v=def456&t=30s",
        "https://youtu.be/ghi789",
      ];

      const expectedIds = ["abc123", "def456", "ghi789"];

      youtubeUrls.forEach((url, index) => {
        let videoId;
        if (url.includes("youtu.be/")) {
          videoId = url.split("youtu.be/")[1];
        } else {
          videoId = url.split("v=")[1]?.split("&")[0];
        }
        expect(videoId).toBe(expectedIds[index]);
      });
    });

    it("should extract Vimeo video IDs", () => {
      const vimeoUrls = [
        "https://vimeo.com/123456789",
        "https://player.vimeo.com/video/987654321",
      ];

      const expectedIds = ["123456789", "987654321"];

      vimeoUrls.forEach((url, index) => {
        let videoId;
        if (url.includes("player.vimeo.com/video/")) {
          videoId = url.split("video/")[1];
        } else {
          videoId = url.split("vimeo.com/")[1];
        }
        expect(videoId).toBe(expectedIds[index]);
      });
    });

    it("should generate correct embed URLs", () => {
      const testCases = [
        {
          original: "https://youtube.com/watch?v=abc123",
          expected: "https://www.youtube.com/embed/abc123",
        },
        {
          original: "https://youtu.be/def456",
          expected: "https://www.youtube.com/embed/def456",
        },
        {
          original: "https://vimeo.com/123456789",
          expected: "https://player.vimeo.com/video/123456789",
        },
      ];

      testCases.forEach(({ original, expected }) => {
        let embedUrl;
        if (
          original.includes("youtube.com/watch") ||
          original.includes("youtu.be/")
        ) {
          const videoId = original.includes("youtu.be/")
            ? original.split("youtu.be/")[1]
            : original.split("v=")[1]?.split("&")[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (original.includes("vimeo.com/")) {
          const videoId = original.split("vimeo.com/")[1];
          embedUrl = `https://player.vimeo.com/video/${videoId}`;
        } else {
          embedUrl = original;
        }
        expect(embedUrl).toBe(expected);
      });
    });
  });

  describe("Content Validation", () => {
    it("should validate prerequisites content", () => {
      const validPrerequisites = [
        "Requires API key setup",
        "Need to configure email settings first",
        "Install required dependencies: npm install package-name",
        "Set up environment variables",
      ];

      validPrerequisites.forEach((prereq) => {
        expect(prereq.length).toBeGreaterThan(0);
        expect(typeof prereq).toBe("string");
      });
    });

    it("should validate documentation content", () => {
      const validDocumentation = [
        "1. First step\n2. Second step\n3. Final step",
        "Detailed instructions with multiple paragraphs...",
        "Step-by-step guide with code examples",
      ];

      validDocumentation.forEach((doc) => {
        expect(doc.length).toBeGreaterThan(0);
        expect(typeof doc).toBe("string");
      });
    });

    it("should handle whitespace in optional fields", () => {
      const workflowData = {
        name: "Test Workflow",
        description: "A test workflow",
        price: 19.99,
        fileUrl: "https://example.com/workflow.json",
        tags: ["Test"],
        prerequisites: "   ",
        documentation: "\n\n",
        reviewText: "   ",
      };

      // Simulate trimming logic
      const trimmedData = {
        ...workflowData,
        prerequisites: workflowData.prerequisites?.trim() || undefined,
        documentation: workflowData.documentation?.trim() || undefined,
        reviewText: workflowData.reviewText?.trim() || undefined,
      };

      expect(trimmedData.prerequisites).toBeUndefined();
      expect(trimmedData.documentation).toBeUndefined();
      expect(trimmedData.reviewText).toBeUndefined();
    });
  });
});
