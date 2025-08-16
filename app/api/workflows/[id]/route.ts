import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { workflowSchema } from "@/types";
import { hasRole } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
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
        },
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const totalRating = workflow.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      workflow.reviews.length > 0 ? totalRating / workflow.reviews.length : 0;

    const workflowWithRating = {
      ...workflow,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: workflow.reviews.length,
    };

    return NextResponse.json(workflowWithRating);
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the existing workflow
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: { tags: true },
    });

    if (!existingWorkflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    // Check permissions: only the workflow owner or admin can edit
    const isOwner = existingWorkflow.userId === session.user.id;
    const isAdmin = hasRole(session.user.roles, "ADMIN");

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "You can only edit your own workflows" },
        { status: 403 }
      );
    }

    // For non-admin users, check if they are verified developers
    if (!isAdmin) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          roles: true,
          sellerVerificationStatus: true,
        },
      });

      if (!user || !user.roles.includes("DEVELOPER")) {
        return NextResponse.json(
          { error: "Only verified developers can edit workflows" },
          { status: 403 }
        );
      }

      if (user.sellerVerificationStatus !== "APPROVED") {
        return NextResponse.json(
          {
            error:
              "Your developer account is not verified. Please complete the verification process before editing workflows.",
            verificationStatus: user.sellerVerificationStatus,
          },
          { status: 403 }
        );
      }
    }

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

    // Update workflow
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        fileUrl,
        prerequisites,
        documentation,
        mediaUrls: mediaUrls || [],
        videoUrl,
        status: "PENDING", // Reset to pending for re-approval
        tags: {
          set: [], // Clear existing tags
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
        reviews: {
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
        },
      },
    });

    // Calculate average rating
    const totalRating = updatedWorkflow.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      updatedWorkflow.reviews.length > 0
        ? totalRating / updatedWorkflow.reviews.length
        : 0;

    const workflowWithRating = {
      ...updatedWorkflow,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: updatedWorkflow.reviews.length,
    };

    return NextResponse.json(workflowWithRating);
  } catch (error) {
    console.error("Error updating workflow:", error);
    return NextResponse.json(
      { error: "Failed to update workflow" },
      { status: 500 }
    );
  }
}
