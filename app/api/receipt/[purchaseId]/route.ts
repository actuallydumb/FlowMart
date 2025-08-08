import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: params.purchaseId },
      include: {
        workflow: true,
        buyer: true,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    // Check if user owns this purchase or is admin
    if (purchase.buyerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate receipt HTML
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${purchase.workflow.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .receipt { max-width: 600px; margin: 0 auto; }
            .item { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>WorkflowHub</h1>
              <h2>Receipt</h2>
              <p>Date: ${new Date(purchase.createdAt).toLocaleDateString()}</p>
              <p>Receipt #: ${purchase.id}</p>
            </div>
            
            <div class="item">
              <h3>${purchase.workflow.name}</h3>
              <p>${purchase.workflow.description}</p>
              <p><strong>Amount:</strong> $${purchase.amount.toFixed(2)}</p>
            </div>
            
            <div class="total">
              <p>Total: $${purchase.amount.toFixed(2)}</p>
            </div>
            
            <div class="footer">
              <p>Thank you for your purchase!</p>
              <p>WorkflowHub - Automation Workflow Marketplace</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(receiptHtml, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="receipt-${purchase.id}.html"`,
      },
    });
  } catch (error) {
    console.error("Receipt generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
