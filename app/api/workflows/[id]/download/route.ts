import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    // Check if user can download (owner or has purchased)
    const isOwner = session.user.id === workflow.userId;
    const hasPurchased = await prisma.purchase.findFirst({
      where: {
        workflowId: params.id,
        buyerId: session.user.id,
        status: "COMPLETED",
      },
    });

    if (!isOwner && !hasPurchased) {
      return NextResponse.json(
        { error: "You must purchase this workflow to download it" },
        { status: 403 }
      );
    }

    // Fetch file from UploadThing
    const fileUrl = workflow.fileUrl;
    if (!fileUrl) {
      return NextResponse.json(
        { error: "Workflow file not found" },
        { status: 404 }
      );
    }

    // Fetch the file content
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch workflow file" },
        { status: 500 }
      );
    }

    const fileBuffer = await fileResponse.arrayBuffer();

    // Update download count if not owner
    if (!isOwner) {
      await prisma.workflow.update({
        where: { id: params.id },
        data: {
          downloads: {
            increment: 1,
          },
        },
      });
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${workflow.name}.json"`,
      },
    });
  } catch (error) {
    console.error("Error downloading workflow:", error);
    return NextResponse.json(
      { error: "Failed to download workflow" },
      { status: 500 }
    );
  }
}
