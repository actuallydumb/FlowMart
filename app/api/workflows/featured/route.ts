import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    const workflows = await prisma.workflow.findMany({
      where: {
        status: "APPROVED",
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [{ downloads: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    // Calculate average ratings and add to workflow objects
    const workflowsWithRating = workflows.map((workflow) => {
      const totalRating = workflow.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        workflow.reviews.length > 0 ? totalRating / workflow.reviews.length : 0;

      return {
        ...workflow,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: workflow.reviews.length,
        reviews: undefined, // Remove reviews array from response
      };
    });

    return NextResponse.json({
      workflows: workflowsWithRating,
    });
  } catch (error) {
    console.error("Error fetching featured workflows:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
