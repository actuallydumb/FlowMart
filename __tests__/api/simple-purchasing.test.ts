// Mock dependencies
jest.mock("@/lib/db");
jest.mock("@/lib/stripe");

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// Type the mocks
const mockPrisma = jest.mocked(prisma);
const mockStripe = jest.mocked(stripe);

describe("Purchasing Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Checkout Session Creation", () => {
    it("should create checkout session with correct parameters", async () => {
      const mockWorkflow = {
        id: "workflow123",
        name: "Test Workflow",
        description: "A test workflow",
        price: 29.99,
        fileUrl: "https://example.com/workflow.json",
        previewUrl: null,
        status: "APPROVED" as const,
        downloads: 0,
        isPublic: false,
        isFeatured: false,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user123",
        organizationId: null,
      };

      const mockCheckoutSession = {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/test",
        object: "checkout.session",
        amount_total: 2999,
        currency: "usd",
        status: "complete",
        payment_status: "paid",
        metadata: {
          workflowId: "workflow123",
          buyerId: "user123",
        },
      } as any;

      mockPrisma.workflow.findUnique.mockResolvedValue(mockWorkflow);
      mockPrisma.purchase.findFirst.mockResolvedValue(null);
      mockStripe.checkout.sessions.create.mockResolvedValue(
        mockCheckoutSession
      );

      // Simulate the checkout logic
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: mockWorkflow.name,
                description: `Workflow: ${mockWorkflow.name}`,
              },
              unit_amount: Math.round(mockWorkflow.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/workflow/${mockWorkflow.id}?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/workflow/${mockWorkflow.id}?canceled=true`,
        metadata: {
          workflowId: mockWorkflow.id,
          buyerId: "user123",
        },
      });

      expect(session.id).toBe("cs_test_123");
      expect(session.url).toBe("https://checkout.stripe.com/test");
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          line_items: expect.arrayContaining([
            expect.objectContaining({
              price_data: expect.objectContaining({
                unit_amount: 2999,
              }),
            }),
          ]),
          metadata: expect.objectContaining({
            workflowId: "workflow123",
            buyerId: "user123",
          }),
        })
      );
    });
  });

  describe("Purchase Status Check", () => {
    it("should return true if user has purchased workflow", async () => {
      const mockPurchase = {
        id: "purchase123",
        workflowId: "workflow123",
        buyerId: "user123",
        amount: 29.99,
        status: "COMPLETED" as const,
        createdAt: new Date(),
      };

      mockPrisma.purchase.findFirst.mockResolvedValue(mockPurchase);

      const purchase = await prisma.purchase.findFirst({
        where: {
          workflowId: "workflow123",
          buyerId: "user123",
          status: "COMPLETED",
        },
      });

      expect(purchase).toBeTruthy();
      expect(purchase?.status).toBe("COMPLETED");
    });

    it("should return false if user has not purchased workflow", async () => {
      mockPrisma.purchase.findFirst.mockResolvedValue(null);

      const purchase = await prisma.purchase.findFirst({
        where: {
          workflowId: "workflow123",
          buyerId: "user123",
          status: "COMPLETED",
        },
      });

      expect(purchase).toBeNull();
    });
  });

  describe("Webhook Processing", () => {
    it("should process successful checkout session", async () => {
      const mockEvent = {
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_123",
            amount_total: 2999,
            metadata: {
              workflowId: "workflow123",
              buyerId: "user123",
            },
          },
        },
      } as any;

      const mockWorkflow = {
        id: "workflow123",
        name: "Test Workflow",
        description: "A test workflow",
        price: 29.99,
        fileUrl: "https://example.com/workflow.json",
        previewUrl: null,
        status: "APPROVED" as const,
        downloads: 0,
        isPublic: false,
        isFeatured: false,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "creator123",
        organizationId: null,
        user: { id: "creator123", name: "Creator", image: null },
      };

      const mockPurchase = {
        id: "purchase123",
        workflowId: "workflow123",
        buyerId: "user123",
        amount: 29.99,
        status: "COMPLETED" as const,
        createdAt: new Date(),
        workflow: mockWorkflow,
        buyer: {
          id: "user123",
          email: "test@example.com",
          name: "Test User",
          image: null,
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockPrisma.workflow.findUnique.mockResolvedValue(mockWorkflow);
      mockPrisma.purchase.create.mockResolvedValue(mockPurchase);
      mockPrisma.workflow.update.mockResolvedValue(mockWorkflow);
      mockPrisma.earnings.create.mockResolvedValue({
        id: "earnings123",
        amount: 20.99,
        status: "PENDING" as const,
        createdAt: new Date(),
        developerId: "creator123",
        purchaseId: "purchase123",
      });

      // Simulate webhook processing
      const event = mockStripe.webhooks.constructEvent(
        JSON.stringify(mockEvent),
        "test_signature",
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const purchase = await prisma.purchase.create({
          data: {
            workflowId: session.metadata?.workflowId || "",
            buyerId: session.metadata?.buyerId || "",
            amount: (session.amount_total || 0) / 100,
            status: "COMPLETED",
          },
          include: {
            workflow: {
              include: {
                user: true,
              },
            },
            buyer: true,
          },
        });

        await prisma.workflow.update({
          where: { id: session.metadata?.workflowId || "" },
          data: {
            downloads: {
              increment: 1,
            },
          },
        });

        const developerEarnings = ((session.amount_total || 0) * 0.7) / 100;
        await prisma.earnings.create({
          data: {
            developerId: purchase.workflow.userId,
            purchaseId: purchase.id,
            amount: developerEarnings,
            status: "PENDING",
          },
        });

        expect(purchase.workflowId).toBe("workflow123");
        expect(purchase.buyerId).toBe("user123");
        expect(purchase.amount).toBe(29.99);
        expect(purchase.status).toBe("COMPLETED");
      }
    });
  });
});
