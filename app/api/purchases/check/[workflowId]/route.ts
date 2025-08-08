import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ hasPurchased: false });
    }

    const purchase = await prisma.purchase.findFirst({
      where: {
        workflowId: params.workflowId,
        buyerId: session.user.id,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ hasPurchased: !!purchase });
  } catch (error) {
    console.error("Error checking purchase status:", error);
    return NextResponse.json(
      { error: "Failed to check purchase status" },
      { status: 500 }
    );
  }
}
