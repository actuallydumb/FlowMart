import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasRole } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!hasRole(session.user.roles, "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: sellerId } = params;
    const body = await request.json();
    const { notes } = body;

    // Check if seller exists and has developer role
    const seller = await prisma.user.findFirst({
      where: {
        id: sellerId,
        roles: {
          has: "DEVELOPER",
        },
      },
      include: {
        sellerVerifications: true,
      },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // Update user's seller verification status
    await prisma.user.update({
      where: { id: sellerId },
      data: {
        isSellerVerified: true,
        sellerVerificationStatus: "APPROVED",
      },
    });

    // Create or update seller verification
    const verification = await prisma.sellerVerification.upsert({
      where: {
        userId: sellerId,
      },
      update: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        notes: notes || null,
      },
      create: {
        userId: sellerId,
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Seller approved successfully",
      verification,
    });
  } catch (error) {
    console.error("Error approving seller:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
