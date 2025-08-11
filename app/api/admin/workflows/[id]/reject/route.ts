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

    const { id: workflowId } = params;
    const body = await request.json();
    const { reason } = body;

    // Check if workflow exists and is pending
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        status: "PENDING",
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found or not pending" },
        { status: 404 }
      );
    }

    // Update workflow status to rejected
    const updatedWorkflow = await prisma.workflow.update({
      where: {
        id: workflowId,
      },
      data: {
        status: "REJECTED",
        isPublic: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Workflow rejected successfully",
      workflow: updatedWorkflow,
    });
  } catch (error) {
    console.error("Error rejecting workflow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
