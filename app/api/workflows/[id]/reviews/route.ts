import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { reviewSchema } from "@/types";
import { hasRole } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.workflowReview.findMany({
      where: {
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Check if user has purchased the workflow
    const purchase = await prisma.purchase.findFirst({
      where: {
        workflowId: params.id,
        buyerId: session.user.id,
        status: "COMPLETED",
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "You must purchase this workflow before leaving a review" },
        { status: 403 }
      );
    }

    // Check if user already has a review for this workflow
    const existingReview = await prisma.workflowReview.findUnique({
      where: {
        workflowId_userId: {
          workflowId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this workflow" },
        { status: 400 }
      );
    }

    // Create new review
    const review = await prisma.workflowReview.create({
      data: {
        workflowId: params.id,
        userId: session.user.id,
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

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
