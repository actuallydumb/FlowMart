import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { reviewSchema } from "@/types";
import { hasRole } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    const review = await prisma.workflowReview.findUnique({
      where: {
        id: params.reviewId,
        workflowId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rating, reviewText } = reviewSchema.parse({
      ...body,
      workflowId: params.id,
    });

    // Get the existing review
    const existingReview = await prisma.workflowReview.findUnique({
      where: {
        id: params.reviewId,
      },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check permissions: only the review author or admin can edit
    const isAuthor = existingReview.userId === session.user.id;
    const isAdmin = hasRole(session.user.roles, "ADMIN");

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You can only edit your own reviews" },
        { status: 403 }
      );
    }

    // Update the review
    const updatedReview = await prisma.workflowReview.update({
      where: {
        id: params.reviewId,
      },
      data: {
        rating,
        reviewText,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the existing review
    const existingReview = await prisma.workflowReview.findUnique({
      where: {
        id: params.reviewId,
      },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check permissions: only the review author or admin can delete
    const isAuthor = existingReview.userId === session.user.id;
    const isAdmin = hasRole(session.user.roles, "ADMIN");

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    // Delete the review
    await prisma.workflowReview.delete({
      where: {
        id: params.reviewId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
