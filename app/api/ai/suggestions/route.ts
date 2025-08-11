import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aiGenerator } from "@/lib/ai-generator";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if AI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "AI suggestions not available - API key not configured",
      });
    }

    const suggestions = await aiGenerator.generateWorkflowSuggestions(
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("AI suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
