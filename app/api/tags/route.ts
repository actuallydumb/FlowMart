import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as any,
          },
        }
      : {};

    const tags = await prisma.tag.findMany({
      where,
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            workflows: true,
          },
        },
      },
      orderBy: [{ workflows: { _count: "desc" } }, { name: "asc" }],
      take: limit,
    });

    return NextResponse.json({
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        workflowCount: tag._count.workflows,
      })),
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
