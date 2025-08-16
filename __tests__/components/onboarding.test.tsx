import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BuyerStep1 from "@/components/onboarding/buyer-step-1";
import BuyerStep2 from "@/components/onboarding/buyer-step-2";
import BuyerStep3 from "@/components/onboarding/buyer-step-3";
import SellerStep1 from "@/components/onboarding/seller-step-1";
import SellerStep2 from "@/components/onboarding/seller-step-2";
import SellerStep3 from "@/components/onboarding/seller-step-3";
import SellerStep4 from "@/components/onboarding/seller-step-4";

// Mock the uploadthing hook
jest.mock("@/lib/uploadthing", () => ({
  useUploadThing: () => ({
    startUpload: jest
      .fn()
      .mockResolvedValue([{ url: "https://example.com/test.pdf" }]),
    isUploading: false,
  }),
}));

describe("Onboarding Components", () => {
  const mockOnNext = jest.fn();
  const mockOnPrevious = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("BuyerStep1", () => {
    it("should render buyer step 1 with interest categories", () => {
      render(<BuyerStep1 onNext={mockOnNext} isSaving={false} />);

      expect(screen.getByText("What interests you?")).toBeInTheDocument();
      expect(screen.getByText("Automation")).toBeInTheDocument();
      expect(screen.getByText("Productivity")).toBeInTheDocument();
      expect(screen.getByText("Development")).toBeInTheDocument();
      expect(screen.getByText("Design")).toBeInTheDocument();
      expect(screen.getByText("Analytics")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
      expect(screen.getByText("E-commerce")).toBeInTheDocument();
      expect(screen.getByText("Marketing")).toBeInTheDocument();
      expect(screen.getByText("Data")).toBeInTheDocument();
      expect(screen.getByText("Security")).toBeInTheDocument();
    });

    it("should allow selecting interests", () => {
      render(<BuyerStep1 onNext={mockOnNext} isSaving={false} />);

      const automationCard = screen
        .getByText("Automation")
        .closest(".cursor-pointer");
      fireEvent.click(automationCard!);

      expect(screen.getByText("1 interest selected")).toBeInTheDocument();
      expect(screen.getByText("Selected")).toBeInTheDocument();
    });

    it("should allow selecting multiple interests", () => {
      render(<BuyerStep1 onNext={mockOnNext} isSaving={false} />);

      const automationCard = screen
        .getByText("Automation")
        .closest(".cursor-pointer");
      const productivityCard = screen
        .getByText("Productivity")
        .closest(".cursor-pointer");

      fireEvent.click(automationCard!);
      fireEvent.click(productivityCard!);

      expect(screen.getByText("2 interests selected")).toBeInTheDocument();
    });

    it("should allow deselecting interests", () => {
      render(<BuyerStep1 onNext={mockOnNext} isSaving={false} />);

      const automationCard = screen
        .getByText("Automation")
        .closest(".cursor-pointer");
      fireEvent.click(automationCard!);
      fireEvent.click(automationCard!);

      expect(
        screen.getByText("Please select at least one interest")
      ).toBeInTheDocument();
    });

    it("should call onNext with correct data when next button is clicked", () => {
      render(<BuyerStep1 onNext={mockOnNext} isSaving={false} />);

      const automationCard = screen
        .getByText("Automation")
        .closest(".cursor-pointer");
      fireEvent.click(automationCard!);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      expect(mockOnNext).toHaveBeenCalledWith({
        step: "buyer-1",
        interests: ["automation"],
      });
    });

    it("should disable next button when no interests are selected", () => {
      render(<BuyerStep1 onNext={mockOnNext} isSaving={false} />);

      const nextButton = screen.getByText("Next");
      expect(nextButton).toBeDisabled();
    });

    it("should show saving state", () => {
      render(<BuyerStep1 onNext={mockOnNext} isSaving={true} />);

      const automationCard = screen
        .getByText("Automation")
        .closest(".cursor-pointer");
      fireEvent.click(automationCard!);

      const nextButton = screen.getByText("Saving...");
      expect(nextButton).toBeDisabled();
    });
  });

  describe("BuyerStep2", () => {
    it("should render buyer step 2 with integration options", () => {
      render(
        <BuyerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      expect(screen.getByText("Connect your tools")).toBeInTheDocument();
      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText("Notion")).toBeInTheDocument();
      expect(screen.getByText("Google Workspace")).toBeInTheDocument();
      expect(screen.getByText("Microsoft 365")).toBeInTheDocument();
      expect(screen.getByText("Zapier")).toBeInTheDocument();
      expect(screen.getByText("Airtable")).toBeInTheDocument();
      expect(screen.getByText("Trello")).toBeInTheDocument();
      expect(screen.getByText("Asana")).toBeInTheDocument();
      expect(screen.getByText("Monday.com")).toBeInTheDocument();
    });

    it("should allow selecting integrations", () => {
      render(
        <BuyerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const slackCard = screen.getByText("Slack").closest(".cursor-pointer");
      fireEvent.click(slackCard!);

      expect(screen.getByText("1 integration selected")).toBeInTheDocument();
    });

    it("should call onNext with correct data", () => {
      render(
        <BuyerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const slackCard = screen.getByText("Slack").closest(".cursor-pointer");
      fireEvent.click(slackCard!);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      expect(mockOnNext).toHaveBeenCalledWith({
        step: "buyer-2",
        integrations: ["slack"],
      });
    });

    it("should call onPrevious when back button is clicked", () => {
      render(
        <BuyerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      expect(mockOnPrevious).toHaveBeenCalled();
    });

    it("should allow proceeding without selecting integrations", () => {
      render(
        <BuyerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      expect(mockOnNext).toHaveBeenCalledWith({
        step: "buyer-2",
        integrations: [],
      });
    });
  });

  describe("BuyerStep3", () => {
    it("should render buyer step 3 completion screen", () => {
      render(
        <BuyerStep3
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      expect(screen.getByText("You're all set!")).toBeInTheDocument();
      expect(screen.getByText(/Welcome to WorkflowKart/)).toBeInTheDocument();
    });

    it("should call onNext with completion data when finish button is clicked", () => {
      render(
        <BuyerStep3
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const finishButton = screen.getByText("Finish Setup");
      fireEvent.click(finishButton);

      expect(mockOnNext).toHaveBeenCalledWith({
        step: "buyer-3",
        completed: true,
      });
    });

    it("should call onPrevious when back button is clicked", () => {
      render(
        <BuyerStep3
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      expect(mockOnPrevious).toHaveBeenCalled();
    });
  });

  describe("SellerStep1", () => {
    it("should render seller step 1 form", () => {
      render(<SellerStep1 onNext={mockOnNext} isSaving={false} />);

      expect(screen.getByText("Tell us about yourself")).toBeInTheDocument();
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Profession")).toBeInTheDocument();
      expect(screen.getByLabelText("Years of Experience")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Organization (Optional)")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Website (Optional)")).toBeInTheDocument();
    });

    it("should validate required fields", async () => {
      render(<SellerStep1 onNext={mockOnNext} isSaving={false} />);

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("Full name is required")).toBeInTheDocument();
        expect(screen.getByText("Profession is required")).toBeInTheDocument();
      });
    });

    it("should validate experience years", async () => {
      render(<SellerStep1 onNext={mockOnNext} isSaving={false} />);

      const experienceInput = screen.getByLabelText("Years of Experience");
      fireEvent.change(experienceInput, { target: { value: "-1" } });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByText("Experience years must be 0 or more")
        ).toBeInTheDocument();
      });
    });

    it("should validate website URL format", async () => {
      render(<SellerStep1 onNext={mockOnNext} isSaving={false} />);

      const nameInput = screen.getByLabelText("Full Name");
      const professionInput = screen.getByLabelText("Profession");
      const experienceInput = screen.getByLabelText("Years of Experience");
      const websiteInput = screen.getByLabelText("Website (Optional)");

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(professionInput, { target: { value: "Developer" } });
      fireEvent.change(experienceInput, { target: { value: "5" } });
      fireEvent.change(websiteInput, { target: { value: "invalid-url" } });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid URL")).toBeInTheDocument();
      });
    });

    it("should call onNext with valid data", async () => {
      render(<SellerStep1 onNext={mockOnNext} isSaving={false} />);

      const nameInput = screen.getByLabelText("Full Name");
      const professionInput = screen.getByLabelText("Profession");
      const experienceInput = screen.getByLabelText("Years of Experience");
      const organizationInput = screen.getByLabelText(
        "Organization (Optional)"
      );
      const websiteInput = screen.getByLabelText("Website (Optional)");

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(professionInput, {
        target: { value: "Software Developer" },
      });
      fireEvent.change(experienceInput, { target: { value: "5" } });
      fireEvent.change(organizationInput, { target: { value: "Tech Corp" } });
      fireEvent.change(websiteInput, {
        target: { value: "https://example.com" },
      });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalledWith({
          step: "seller-1",
          name: "John Doe",
          profession: "Software Developer",
          experienceYears: 5,
          organization: "Tech Corp",
          website: "https://example.com",
        });
      });
    });
  });

  describe("SellerStep2", () => {
    it("should render seller step 2 payment form", () => {
      render(
        <SellerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      expect(screen.getByText("Payment Information")).toBeInTheDocument();
      expect(screen.getByLabelText("Bank Account Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Bank Account Number")).toBeInTheDocument();
      expect(screen.getByLabelText("Bank Routing Number")).toBeInTheDocument();
      expect(
        screen.getByLabelText("PayPal Email (Optional)")
      ).toBeInTheDocument();
    });

    it("should validate required payment fields", async () => {
      render(
        <SellerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByText("Bank account name is required")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Bank account number is required")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Bank routing number is required")
        ).toBeInTheDocument();
      });
    });

    it("should validate PayPal email format", async () => {
      render(
        <SellerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const paypalInput = screen.getByLabelText("PayPal Email (Optional)");
      fireEvent.change(paypalInput, { target: { value: "invalid-email" } });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      });
    });

    it("should call onNext with valid payment data", async () => {
      render(
        <SellerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const accountNameInput = screen.getByLabelText("Bank Account Name");
      const accountNumberInput = screen.getByLabelText("Bank Account Number");
      const routingNumberInput = screen.getByLabelText("Bank Routing Number");
      const paypalInput = screen.getByLabelText("PayPal Email (Optional)");

      fireEvent.change(accountNameInput, { target: { value: "John Doe" } });
      fireEvent.change(accountNumberInput, { target: { value: "1234567890" } });
      fireEvent.change(routingNumberInput, { target: { value: "987654321" } });
      fireEvent.change(paypalInput, { target: { value: "john@example.com" } });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalledWith({
          step: "seller-2",
          bankAccountName: "John Doe",
          bankAccountNumber: "1234567890",
          bankRoutingNumber: "987654321",
          paypalEmail: "john@example.com",
        });
      });
    });

    it("should call onPrevious when back button is clicked", () => {
      render(
        <SellerStep2
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      expect(mockOnPrevious).toHaveBeenCalled();
    });
  });

  describe("SellerStep3", () => {
    it("should render seller step 3 verification form", () => {
      render(
        <SellerStep3
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      expect(screen.getByText("Verification Documents")).toBeInTheDocument();
      expect(
        screen.getByText(/Please upload at least one document/)
      ).toBeInTheDocument();
    });

    it("should validate that at least one document is uploaded", async () => {
      render(
        <SellerStep3
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getByText("At least one verification document is required")
        ).toBeInTheDocument();
      });
    });

    it("should call onPrevious when back button is clicked", () => {
      render(
        <SellerStep3
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      expect(mockOnPrevious).toHaveBeenCalled();
    });
  });

  describe("SellerStep4", () => {
    it("should render seller step 4 completion screen", () => {
      render(
        <SellerStep4
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      expect(screen.getByText("Application Submitted!")).toBeInTheDocument();
      expect(screen.getByText(/Thank you for applying/)).toBeInTheDocument();
    });

    it("should call onNext with completion data when finish button is clicked", () => {
      render(
        <SellerStep4
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const finishButton = screen.getByText("Finish");
      fireEvent.click(finishButton);

      expect(mockOnNext).toHaveBeenCalledWith({
        step: "seller-4",
        completed: true,
      });
    });

    it("should call onPrevious when back button is clicked", () => {
      render(
        <SellerStep4
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isSaving={false}
        />
      );

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      expect(mockOnPrevious).toHaveBeenCalled();
    });
  });
});
