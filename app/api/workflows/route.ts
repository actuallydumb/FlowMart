import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { workflowSchema } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const where: any = {
      status: "APPROVED", // Only show approved workflows by default
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const workflows = await prisma.workflow.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average ratings for each workflow
    const workflowsWithRatings = workflows.map((workflow) => {
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

    return NextResponse.json(workflowsWithRatings);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflows" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      fileUrl,
      tags,
      prerequisites,
      documentation,
      mediaUrls,
      videoUrl,
    } = workflowSchema.parse(body);

    // Create or find tags
    const tagPromises = tags.map(async (tagName: string) => {
      const existingTag = await prisma.tag.findUnique({
        where: { name: tagName },
      });

      if (existingTag) {
        return existingTag;
      }

      return await prisma.tag.create({
        data: { name: tagName },
      });
    });

    const createdTags = await Promise.all(tagPromises);

    // Create workflow
    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        price,
        fileUrl,
        prerequisites,
        documentation,
        mediaUrls: mediaUrls || [],
        videoUrl,
        status: "PENDING",
        userId: session.user.id,
        tags: {
          connect: createdTags.map((tag) => ({ id: tag.id })),
        },
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
      },
    });

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    );
  }
}
