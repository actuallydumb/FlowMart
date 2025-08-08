import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendPurchaseConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Create purchase record
        const purchase = await prisma.purchase.create({
          data: {
            workflowId: session.metadata?.workflowId || "",
            buyerId: session.metadata?.buyerId || "",
            amount: (session.amount_total || 0) / 100, // Convert from cents
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

        // Update workflow download count
        if (session.metadata?.workflowId) {
          await prisma.workflow.update({
            where: { id: session.metadata.workflowId },
            data: {
              downloads: {
                increment: 1,
              },
            },
          });
        }

        // Create earnings record for developer (70% of sale)
        const developerEarnings = ((session.amount_total || 0) * 0.7) / 100;
        await prisma.earnings.create({
          data: {
            developerId: purchase.workflow.userId,
            purchaseId: purchase.id,
            amount: developerEarnings,
            status: "PENDING",
          },
        });

        // Send confirmation emails
        await sendPurchaseConfirmationEmail({
          buyerEmail: purchase.buyer.email!,
          buyerName: purchase.buyer.name!,
          workflowName: purchase.workflow.name,
          amount: purchase.amount,
        });

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        // Handle payment intent success if needed
        console.log("Payment intent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        // Update purchase status to failed
        await prisma.purchase.updateMany({
          where: {
            workflowId: paymentIntent.metadata.workflowId,
            buyerId: paymentIntent.metadata.buyerId,
            status: "PENDING",
          },
          data: {
            status: "FAILED",
          },
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
