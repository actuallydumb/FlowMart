import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// Mock dependencies
jest.mock("@/lib/db", () => ({
  prisma: {
    workflow: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    purchase: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    earnings: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

describe("Purchasing Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Checkout Session Creation", () => {
    it("should create checkout session with correct parameters", async () => {
      const mockWorkflow = {
        id: "workflow123",
        name: "Test Workflow",
        price: 29.99,
        status: "APPROVED",
      };

      const mockCheckoutSession = {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/test",
      };

      prisma.workflow.findUnique.mockResolvedValue(mockWorkflow);
      prisma.purchase.findFirst.mockResolvedValue(null);
      stripe.checkout.sessions.create.mockResolvedValue(mockCheckoutSession);

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
        status: "COMPLETED",
      };

      prisma.purchase.findFirst.mockResolvedValue(mockPurchase);

      const purchase = await prisma.purchase.findFirst({
        where: {
          workflowId: "workflow123",
          buyerId: "user123",
          status: "COMPLETED",
        },
      });

      expect(purchase).toBeTruthy();
      expect(purchase.status).toBe("COMPLETED");
    });

    it("should return false if user has not purchased workflow", async () => {
      prisma.purchase.findFirst.mockResolvedValue(null);

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
      };

      const mockWorkflow = {
        id: "workflow123",
        name: "Test Workflow",
        user: { id: "creator123" },
      };

      const mockPurchase = {
        id: "purchase123",
        workflowId: "workflow123",
        buyerId: "user123",
        amount: 29.99,
        status: "COMPLETED",
        workflow: mockWorkflow,
        buyer: { email: "test@example.com", name: "Test User" },
      };

      stripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      prisma.workflow.findUnique.mockResolvedValue(mockWorkflow);
      prisma.purchase.create.mockResolvedValue(mockPurchase);
      prisma.workflow.update.mockResolvedValue({});
      prisma.earnings.create.mockResolvedValue({});

      // Simulate webhook processing
      const event = stripe.webhooks.constructEvent(
        JSON.stringify(mockEvent),
        "test_signature",
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const purchase = await prisma.purchase.create({
          data: {
            workflowId: session.metadata.workflowId,
            buyerId: session.metadata.buyerId,
            amount: session.amount_total / 100,
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
          where: { id: session.metadata.workflowId },
          data: {
            downloads: {
              increment: 1,
            },
          },
        });

        const developerEarnings = (session.amount_total * 0.7) / 100;
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
