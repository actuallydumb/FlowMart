import { POST } from "@/app/api/onboarding/save/route";
import { prisma } from "@/lib/db";

// Mock MockNextRequest
class MockMockNextRequest {
  method: string;
  body: string;
  headers: Headers;

  constructor(url: string, options: { method: string; body: string }) {
    this.method = options.method;
    this.body = options.body;
    this.headers = new Headers();
  }

  async json() {
    return JSON.parse(this.body);
  }
}

// Mock NextAuth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
}));

// Mock Prisma
jest.mock("@/lib/db", () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
    sellerVerification: {
      upsert: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Onboarding API", () => {
  const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
    roles: ["BUYER"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  describe("Buyer Onboarding Steps", () => {
    describe("Buyer Step 1 - Interests", () => {
      it("should save buyer step 1 with valid interests", async () => {
        const requestBody = {
          step: "buyer-1",
          interests: ["automation", "productivity"],
        };

        mockPrisma.user.update.mockResolvedValue({
          ...mockUser,
          onboardingCompleted: false,
          onboardingStep: 1,
          interests: ["automation", "productivity"],
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: {
            onboardingStep: 1,
            interests: ["automation", "productivity"],
          },
        });
      });

      it("should reject buyer step 1 with empty interests", async () => {
        const requestBody = {
          step: "buyer-1",
          interests: [],
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Validation error");
        expect(data.details[0].message).toContain(
          "Please select at least one interest"
        );
      });

      it("should reject buyer step 1 with invalid step value", async () => {
        const requestBody = {
          step: "invalid-step",
          interests: ["automation"],
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Validation error");
      });
    });

    describe("Buyer Step 2 - Integrations", () => {
      it("should save buyer step 2 with integrations", async () => {
        const requestBody = {
          step: "buyer-2",
          integrations: ["slack", "notion"],
        };

        mockPrisma.user.update.mockResolvedValue({
          ...mockUser,
          onboardingCompleted: false,
          onboardingStep: 2,
          integrations: ["slack", "notion"],
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: {
            onboardingStep: 2,
            integrations: ["slack", "notion"],
          },
        });
      });

      it("should save buyer step 2 with empty integrations", async () => {
        const requestBody = {
          step: "buyer-2",
          integrations: [],
        };

        mockPrisma.user.update.mockResolvedValue({
          ...mockUser,
          onboardingCompleted: false,
          onboardingStep: 2,
          integrations: [],
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: {
            onboardingStep: 2,
            integrations: [],
          },
        });
      });
    });

    describe("Buyer Step 3 - Completion", () => {
      it("should complete buyer onboarding", async () => {
        const requestBody = {
          step: "buyer-3",
          completed: true,
        };

        mockPrisma.user.update.mockResolvedValue({
          ...mockUser,
          onboardingCompleted: true,
          onboardingStep: 1,
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: {
            onboardingStep: 1,
            onboardingCompleted: true,
          },
        });
      });

      it("should reject buyer step 3 with invalid completed value", async () => {
        const requestBody = {
          step: "buyer-3",
          completed: false,
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Validation error");
      });
    });
  });

  describe("Seller Onboarding Steps", () => {
    const sellerUser = {
      ...mockUser,
      roles: ["DEVELOPER"],
    };

    beforeEach(() => {
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
        user: sellerUser,
      });
    });

    describe("Seller Step 1 - Basic Information", () => {
      it("should save seller step 1 with valid data", async () => {
        const requestBody = {
          step: "seller-1",
          name: "John Doe",
          profession: "Software Developer",
          experienceYears: 5,
          organization: "Tech Corp",
          website: "https://example.com",
        };

        mockPrisma.user.update.mockResolvedValue({
          ...sellerUser,
          onboardingCompleted: false,
          onboardingStep: 1,
          name: "John Doe",
          profession: "Software Developer",
          experienceYears: 5,
          organizationId: "org-id",
          website: "https://example.com",
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: sellerUser.id },
          data: {
            onboardingStep: 1,
            name: "John Doe",
            profession: "Software Developer",
            experienceYears: 5,
            organizationId: "org-id",
            website: "https://example.com",
          },
        });
      });

      it("should reject seller step 1 with missing required fields", async () => {
        const requestBody = {
          step: "seller-1",
          name: "",
          profession: "",
          experienceYears: 5,
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Validation error");
      });

      it("should reject seller step 1 with invalid website URL", async () => {
        const requestBody = {
          step: "seller-1",
          name: "John Doe",
          profession: "Developer",
          experienceYears: 5,
          website: "invalid-url",
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Validation error");
      });

      it("should accept seller step 1 with empty website", async () => {
        const requestBody = {
          step: "seller-1",
          name: "John Doe",
          profession: "Developer",
          experienceYears: 5,
          website: "",
        };

        mockPrisma.user.update.mockResolvedValue({
          ...sellerUser,
          onboardingCompleted: false,
          onboardingStep: 1,
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
      });
    });

    describe("Seller Step 2 - Payment Information", () => {
      it("should save seller step 2 with valid payment data", async () => {
        const requestBody = {
          step: "seller-2",
          bankAccountName: "John Doe",
          bankAccountNumber: "1234567890",
          bankRoutingNumber: "987654321",
          paypalEmail: "john@example.com",
        };

        mockPrisma.user.update.mockResolvedValue({
          ...sellerUser,
          onboardingCompleted: false,
          onboardingStep: 2,
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: sellerUser.id },
          data: {
            onboardingStep: 2,
            bankAccountName: "John Doe",
            bankAccountNumber: "1234567890",
            bankRoutingNumber: "987654321",
            paypalEmail: "john@example.com",
          },
        });
      });

      it("should reject seller step 2 with missing required fields", async () => {
        const requestBody = {
          step: "seller-2",
          bankAccountName: "",
          bankAccountNumber: "",
          bankRoutingNumber: "987654321",
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Validation error");
      });

      it("should accept seller step 2 without PayPal email", async () => {
        const requestBody = {
          step: "seller-2",
          bankAccountName: "John Doe",
          bankAccountNumber: "1234567890",
          bankRoutingNumber: "987654321",
        };

        mockPrisma.user.update.mockResolvedValue({
          ...sellerUser,
          onboardingCompleted: false,
          onboardingStep: 2,
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
      });
    });

    describe("Seller Step 3 - Verification Documents", () => {
      it("should save seller step 3 with verification documents", async () => {
        const requestBody = {
          step: "seller-3",
          verificationDocs: [
            "https://example.com/doc1.pdf",
            "https://example.com/doc2.pdf",
          ],
        };

        mockPrisma.user.update.mockResolvedValue({
          ...sellerUser,
          onboardingCompleted: false,
          onboardingStep: 3,
          sellerVerificationStatus: "PENDING",
        } as any);

        mockPrisma.sellerVerification.upsert.mockResolvedValue({
          id: "verification-id",
          userId: sellerUser.id,
          status: "PENDING",
          submittedAt: new Date(),
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: sellerUser.id },
          data: {
            onboardingStep: 3,
            verificationDocs: [
              "https://example.com/doc1.pdf",
              "https://example.com/doc2.pdf",
            ],
            sellerVerificationStatus: "PENDING",
          },
        });
        expect(mockPrisma.sellerVerification.upsert).toHaveBeenCalled();
      });

      it("should reject seller step 3 with empty verification documents", async () => {
        const requestBody = {
          step: "seller-3",
          verificationDocs: [],
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Validation error");
        expect(data.details[0].message).toContain(
          "At least one verification document is required"
        );
      });
    });

    describe("Seller Step 4 - Completion", () => {
      it("should complete seller onboarding", async () => {
        const requestBody = {
          step: "seller-4",
          completed: true,
        };

        mockPrisma.user.update.mockResolvedValue({
          ...sellerUser,
          onboardingCompleted: true,
          onboardingStep: 1,
        } as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: sellerUser.id },
          data: {
            onboardingStep: 1,
            onboardingCompleted: true,
          },
        });
      });
    });
  });

  describe("Authentication and Authorization", () => {
    it("should reject request without authentication", async () => {
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue(
        null
      );

      const requestBody = {
        step: "buyer-1",
        interests: ["automation"],
      };

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/save",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should reject request without user ID", async () => {
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
        user: {},
      });

      const requestBody = {
        step: "buyer-1",
        interests: ["automation"],
      };

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/save",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPrisma.user.update.mockRejectedValue(new Error("Database error"));

      const requestBody = {
        step: "buyer-1",
        interests: ["automation"],
      };

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/save",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to save onboarding data");
    });

    it("should handle invalid JSON gracefully", async () => {
      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/save",
        {
          method: "POST",
          body: "invalid json",
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to save onboarding data");
    });
  });

  describe("Step Number Mapping", () => {
    it("should correctly map buyer step strings to numbers", async () => {
      const testCases = [
        { step: "buyer-1", expectedNumber: 1 },
        { step: "buyer-2", expectedNumber: 2 },
        { step: "buyer-3", expectedNumber: 3 },
      ];

      for (const testCase of testCases) {
        mockPrisma.user.update.mockResolvedValue({
          ...mockUser,
          onboardingCompleted: false,
          onboardingStep: testCase.expectedNumber,
        } as any);

        const requestBody = {
          step: testCase.step,
          interests: ["automation"],
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(200);

        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: expect.objectContaining({
            onboardingStep: testCase.expectedNumber,
          }),
        });
      }
    });

    it("should correctly map seller step strings to numbers", async () => {
      const sellerUser = { ...mockUser, roles: ["DEVELOPER"] };
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
        user: sellerUser,
      });

      const testCases = [
        { step: "seller-1", expectedNumber: 1 },
        { step: "seller-2", expectedNumber: 2 },
        { step: "seller-3", expectedNumber: 3 },
        { step: "seller-4", expectedNumber: 4 },
      ];

      for (const testCase of testCases) {
        mockPrisma.user.update.mockResolvedValue({
          ...sellerUser,
          onboardingCompleted: false,
          onboardingStep: testCase.expectedNumber,
        } as any);

        const requestBody = {
          step: testCase.step,
          name: "Test User",
          profession: "Developer",
          experienceYears: 5,
        };

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/save",
          {
            method: "POST",
            body: JSON.stringify(requestBody),
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(200);

        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: sellerUser.id },
          data: expect.objectContaining({
            onboardingStep: testCase.expectedNumber,
          }),
        });
      }
    });
  });
});
