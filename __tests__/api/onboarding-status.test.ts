import { GET } from "@/app/api/onboarding/status/route";
import { prisma } from "@/lib/db";

// Mock MockNextRequest
class MockMockNextRequest {
  method: string;
  body: string;
  headers: Headers;

  constructor(url: string, options?: { method: string; body: string }) {
    this.method = options?.method || "GET";
    this.body = options?.body || "";
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
      findUnique: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Onboarding Status API", () => {
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

  describe("GET /api/onboarding/status", () => {
    it("should return buyer onboarding status", async () => {
      const mockUserData = {
        id: mockUser.id,
        email: mockUser.email,
        roles: ["BUYER"],
        onboardingCompleted: false,
        onboardingStep: 1,
        interests: ["automation"],
        integrations: [],
        sellerVerificationStatus: null,
        isSellerVerified: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUserData as any);

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        onboardingCompleted: false,
        onboardingStep: 1,
        roles: ["BUYER"],
        sellerVerificationStatus: null,
        isSellerVerified: false,
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: {
          onboardingCompleted: true,
          onboardingStep: true,
          roles: true,
          sellerVerificationStatus: true,
          isSellerVerified: true,
        },
      });
    });

    it("should return seller onboarding status", async () => {
      const sellerUser = { ...mockUser, roles: ["DEVELOPER"] };
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
        user: sellerUser,
      });

      const mockUserData = {
        id: sellerUser.id,
        email: sellerUser.email,
        roles: ["DEVELOPER"],
        onboardingCompleted: false,
        onboardingStep: 2,
        interests: [],
        integrations: [],
        sellerVerificationStatus: "PENDING",
        isSellerVerified: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUserData as any);

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        onboardingCompleted: false,
        onboardingStep: 2,
        roles: ["DEVELOPER"],
        sellerVerificationStatus: "PENDING",
        isSellerVerified: false,
      });
    });

    it("should return completed onboarding status", async () => {
      const mockUserData = {
        id: mockUser.id,
        email: mockUser.email,
        roles: ["BUYER"],
        onboardingCompleted: true,
        onboardingStep: 1,
        interests: ["automation", "productivity"],
        integrations: ["slack"],
        sellerVerificationStatus: null,
        isSellerVerified: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUserData as any);

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        onboardingCompleted: true,
        onboardingStep: 1,
        roles: ["BUYER"],
        sellerVerificationStatus: null,
        isSellerVerified: false,
      });
    });

    it("should return verified seller status", async () => {
      const sellerUser = { ...mockUser, roles: ["DEVELOPER"] };
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
        user: sellerUser,
      });

      const mockUserData = {
        id: sellerUser.id,
        email: sellerUser.email,
        roles: ["DEVELOPER"],
        onboardingCompleted: true,
        onboardingStep: 1,
        interests: [],
        integrations: [],
        sellerVerificationStatus: "APPROVED",
        isSellerVerified: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUserData as any);

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        onboardingCompleted: true,
        onboardingStep: 1,
        roles: ["DEVELOPER"],
        sellerVerificationStatus: "APPROVED",
        isSellerVerified: true,
      });
    });

    it("should handle user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should reject request without authentication", async () => {
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue(
        null
      );

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should reject request without user ID", async () => {
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
        user: {},
      });

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should handle database errors gracefully", async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error("Database error"));

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch onboarding status");
    });

    it("should handle different seller verification statuses", async () => {
      const sellerUser = { ...mockUser, roles: ["DEVELOPER"] };
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
        user: sellerUser,
      });

      const statuses = ["PENDING", "APPROVED", "REJECTED"];

      for (const status of statuses) {
        const mockUserData = {
          id: sellerUser.id,
          email: sellerUser.email,
          roles: ["DEVELOPER"],
          onboardingCompleted: false,
          onboardingStep: 3,
          interests: [],
          integrations: [],
          sellerVerificationStatus: status,
          isSellerVerified: status === "APPROVED",
        };

        mockPrisma.user.findUnique.mockResolvedValue(mockUserData as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/status"
        );

        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.sellerVerificationStatus).toBe(status);
        expect(data.isSellerVerified).toBe(status === "APPROVED");
      }
    });

    it("should handle users with multiple roles", async () => {
      const multiRoleUser = { ...mockUser, roles: ["BUYER", "DEVELOPER"] };
      (require("next-auth").getServerSession as jest.Mock).mockResolvedValue({
        user: multiRoleUser,
      });

      const mockUserData = {
        id: multiRoleUser.id,
        email: multiRoleUser.email,
        roles: ["BUYER", "DEVELOPER"],
        onboardingCompleted: false,
        onboardingStep: 1,
        interests: ["automation"],
        integrations: [],
        sellerVerificationStatus: "PENDING",
        isSellerVerified: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUserData as any);

      const request = new MockNextRequest(
        "http://localhost:3000/api/onboarding/status"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.roles).toEqual(["BUYER", "DEVELOPER"]);
    });

    it("should handle different onboarding step values", async () => {
      const steps = [1, 2, 3, 4];

      for (const step of steps) {
        const mockUserData = {
          id: mockUser.id,
          email: mockUser.email,
          roles: ["BUYER"],
          onboardingCompleted: false,
          onboardingStep: step,
          interests: ["automation"],
          integrations: [],
          sellerVerificationStatus: null,
          isSellerVerified: false,
        };

        mockPrisma.user.findUnique.mockResolvedValue(mockUserData as any);

        const request = new MockNextRequest(
          "http://localhost:3000/api/onboarding/status"
        );

        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.onboardingStep).toBe(step);
      }
    });
  });
});
