import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasRole } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!hasRole(session.user.roles, "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        where: {
          status: "PENDING",
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
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.workflow.count({
        where: {
          status: "PENDING",
        },
      }),
    ]);

    // Calculate average ratings
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
      success: true,
      workflows: workflowsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching pending workflows:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
