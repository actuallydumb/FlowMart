import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runtimeEngine } from "@/lib/runtime-engine";
import { workflowExecutionSchema } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = workflowExecutionSchema.parse(body);

    const execution = await runtimeEngine.executeWorkflow(
      validatedData.workflowId,
      session.user.id,
      validatedData.input
    );

    return NextResponse.json({
      success: true,
      data: execution,
    });
  } catch (error) {
    console.error("Workflow execution error:", error);
    return NextResponse.json(
      { error: "Failed to execute workflow" },
      { status: 500 }
    );
  }
}
