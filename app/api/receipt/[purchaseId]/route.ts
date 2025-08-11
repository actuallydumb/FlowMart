import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasRole } from "@/types";

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
    if (
      purchase.buyerId !== session.user.id &&
      !hasRole(session.user.roles, "ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      purchase: {
        id: purchase.id,
        amount: purchase.amount,
        status: purchase.status,
        createdAt: purchase.createdAt,
        workflow: {
          id: purchase.workflow.id,
          name: purchase.workflow.name,
          description: purchase.workflow.description,
          fileUrl: purchase.workflow.fileUrl,
        },
        buyer: {
          id: purchase.buyer.id,
          name: purchase.buyer.name,
          email: purchase.buyer.email,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
