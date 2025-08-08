import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aiGenerator } from "@/lib/ai-generator";
import { z } from "zod";

const generateSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = generateSchema.parse(body);

    const workflow = await aiGenerator.generateWorkflowFromDescription(
      validatedData.description,
      session.user.id,
      validatedData.tags || []
    );

    return NextResponse.json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate workflow" },
      { status: 500 }
    );
  }
}
