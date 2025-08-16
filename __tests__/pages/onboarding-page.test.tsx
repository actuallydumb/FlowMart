import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OnboardingPage from "@/app/onboarding/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("OnboardingPage", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockClear();
  });

  describe("Authentication", () => {
    it("should redirect to signin when not authenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: jest.fn(),
      });

      render(<OnboardingPage />);

      expect(mockRouter.push).toHaveBeenCalledWith("/auth/signin");
    });

    it("should show loading state while checking authentication", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: jest.fn(),
      });

      render(<OnboardingPage />);

      expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    });
  });

  describe("Buyer Onboarding Flow", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "test-user-id",
            email: "test@example.com",
            roles: ["BUYER"],
          },
        },
        status: "authenticated",
        update: jest.fn(),
      });
    });

    it("should render buyer onboarding with step 1", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          onboardingCompleted: false,
          onboardingStep: 1,
          roles: ["BUYER"],
          sellerVerificationStatus: null,
          isSellerVerified: false,
        }),
      });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("Buyer Onboarding")).toBeInTheDocument();
        expect(screen.getByText("What interests you?")).toBeInTheDocument();
        expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
        expect(screen.getByText("33% Complete")).toBeInTheDocument();
      });
    });

    it("should progress through buyer steps", async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            onboardingCompleted: false,
            onboardingStep: 1,
            roles: ["BUYER"],
            sellerVerificationStatus: null,
            isSellerVerified: false,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            user: {
              onboardingCompleted: false,
              onboardingStep: 2,
              roles: ["BUYER"],
              sellerVerificationStatus: null,
              isSellerVerified: false,
            },
          }),
        });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("What interests you?")).toBeInTheDocument();
      });

      // Select an interest and proceed
      const automationCard = screen
        .getByText("Automation")
        .closest(".cursor-pointer");
      fireEvent.click(automationCard!);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("Connect your tools")).toBeInTheDocument();
        expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
        expect(screen.getByText("67% Complete")).toBeInTheDocument();
      });
    });

    it("should complete buyer onboarding", async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            onboardingCompleted: false,
            onboardingStep: 3,
            roles: ["BUYER"],
            sellerVerificationStatus: null,
            isSellerVerified: false,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            user: {
              onboardingCompleted: true,
              onboardingStep: 1,
              roles: ["BUYER"],
              sellerVerificationStatus: null,
              isSellerVerified: false,
            },
          }),
        });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("You're all set!")).toBeInTheDocument();
      });

      const finishButton = screen.getByText("Finish Setup");
      fireEvent.click(finishButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("should handle navigation between steps", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          onboardingCompleted: false,
          onboardingStep: 2,
          roles: ["BUYER"],
          sellerVerificationStatus: null,
          isSellerVerified: false,
        }),
      });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("Connect your tools")).toBeInTheDocument();
      });

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByText("What interests you?")).toBeInTheDocument();
        expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
      });
    });
  });

  describe("Seller Onboarding Flow", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "test-user-id",
            email: "test@example.com",
            roles: ["DEVELOPER"],
          },
        },
        status: "authenticated",
        update: jest.fn(),
      });
    });

    it("should render seller onboarding with step 1", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          onboardingCompleted: false,
          onboardingStep: 1,
          roles: ["DEVELOPER"],
          sellerVerificationStatus: "PENDING",
          isSellerVerified: false,
        }),
      });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("Seller Onboarding")).toBeInTheDocument();
        expect(screen.getByText("Tell us about yourself")).toBeInTheDocument();
        expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
        expect(screen.getByText("25% Complete")).toBeInTheDocument();
      });
    });

    it("should progress through seller steps", async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            onboardingCompleted: false,
            onboardingStep: 1,
            roles: ["DEVELOPER"],
            sellerVerificationStatus: "PENDING",
            isSellerVerified: false,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            user: {
              onboardingCompleted: false,
              onboardingStep: 2,
              roles: ["DEVELOPER"],
              sellerVerificationStatus: "PENDING",
              isSellerVerified: false,
            },
          }),
        });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("Tell us about yourself")).toBeInTheDocument();
      });

      // Fill out the form
      const nameInput = screen.getByLabelText("Full Name");
      const professionInput = screen.getByLabelText("Profession");
      const experienceInput = screen.getByLabelText("Years of Experience");

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(professionInput, {
        target: { value: "Software Developer" },
      });
      fireEvent.change(experienceInput, { target: { value: "5" } });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("Payment Information")).toBeInTheDocument();
        expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();
        expect(screen.getByText("50% Complete")).toBeInTheDocument();
      });
    });

    it("should complete seller onboarding", async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            onboardingCompleted: false,
            onboardingStep: 4,
            roles: ["DEVELOPER"],
            sellerVerificationStatus: "PENDING",
            isSellerVerified: false,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            user: {
              onboardingCompleted: true,
              onboardingStep: 1,
              roles: ["DEVELOPER"],
              sellerVerificationStatus: "PENDING",
              isSellerVerified: false,
            },
          }),
        });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("Application Submitted!")).toBeInTheDocument();
      });

      const finishButton = screen.getByText("Finish");
      fireEvent.click(finishButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      });
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "test-user-id",
            email: "test@example.com",
            roles: ["BUYER"],
          },
        },
        status: "authenticated",
        update: jest.fn(),
      });
    });

    it("should handle API errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("Error")).toBeInTheDocument();
        expect(
          screen.getByText(/Failed to load onboarding status/)
        ).toBeInTheDocument();
      });
    });

    it("should handle step save errors", async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            onboardingCompleted: false,
            onboardingStep: 1,
            roles: ["BUYER"],
            sellerVerificationStatus: null,
            isSellerVerified: false,
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({
            error: "Validation error",
            details: [{ message: "Please select at least one interest" }],
          }),
        });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("What interests you?")).toBeInTheDocument();
      });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please select at least one interest")
        ).toBeInTheDocument();
      });
    });

    it("should redirect to dashboard if onboarding is already completed", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          onboardingCompleted: true,
          onboardingStep: 1,
          roles: ["BUYER"],
          sellerVerificationStatus: null,
          isSellerVerified: false,
        }),
      });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      });
    });
  });

  describe("Multi-Role Users", () => {
    it("should handle users with multiple roles", async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "test-user-id",
            email: "test@example.com",
            roles: ["BUYER", "DEVELOPER"],
          },
        },
        status: "authenticated",
        update: jest.fn(),
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          onboardingCompleted: false,
          onboardingStep: 1,
          roles: ["BUYER", "DEVELOPER"],
          sellerVerificationStatus: "PENDING",
          isSellerVerified: false,
        }),
      });

      render(<OnboardingPage />);

      await waitFor(() => {
        expect(screen.getByText("Buyer Onboarding")).toBeInTheDocument();
        expect(screen.getByText("What interests you?")).toBeInTheDocument();
      });
    });
  });

  describe("Progress Tracking", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "test-user-id",
            email: "test@example.com",
            roles: ["BUYER"],
          },
        },
        status: "authenticated",
        update: jest.fn(),
      });
    });

    it("should show correct progress for each step", async () => {
      const steps = [
        { step: 1, progress: "33% Complete" },
        { step: 2, progress: "67% Complete" },
        { step: 3, progress: "100% Complete" },
      ];

      for (const { step, progress } of steps) {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            onboardingCompleted: false,
            onboardingStep: step,
            roles: ["BUYER"],
            sellerVerificationStatus: null,
            isSellerVerified: false,
          }),
        });

        const { unmount } = render(<OnboardingPage />);

        await waitFor(() => {
          expect(screen.getByText(`Step ${step} of 3`)).toBeInTheDocument();
          expect(screen.getByText(progress)).toBeInTheDocument();
        });

        unmount();
      }
    });
  });
});
