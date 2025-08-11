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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d, 1y

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get workflows created over time
    const workflowsOverTime = await prisma.workflow.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get sales data
    const salesData = await prisma.purchase.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
        },
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get average ratings over time
    const ratingsData = await prisma.workflowReview.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _avg: {
        rating: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get most popular categories (tags)
    const popularCategories = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            workflows: true,
          },
        },
      },
      orderBy: {
        workflows: {
          _count: "desc",
        },
      },
      take: 10,
    });

    // Get top performing workflows
    const topWorkflows = await prisma.workflow.findMany({
      where: {
        status: "APPROVED",
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
      orderBy: [
        {
          downloads: "desc",
        },
        {
          purchases: {
            _count: "desc",
          },
        },
      ],
      take: 10,
    });

    // Calculate total metrics
    const totalWorkflows = await prisma.workflow.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const totalSales = await prisma.purchase.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    const averageRating = await prisma.workflowReview.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _avg: {
        rating: true,
      },
    });

    // Format data for charts
    const workflowsChartData = workflowsOverTime.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      count: item._count.id,
    }));

    const salesChartData = salesData.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      amount: item._sum.amount || 0,
    }));

    const ratingsChartData = ratingsData.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      rating: item._avg.rating || 0,
    }));

    const categoriesChartData = popularCategories.map((category) => ({
      name: category.name,
      count: category._count.workflows,
    }));

    return NextResponse.json({
      workflowsOverTime: workflowsChartData,
      salesOverTime: salesChartData,
      ratingsOverTime: ratingsChartData,
      popularCategories: categoriesChartData,
      topWorkflows: topWorkflows.map((workflow) => ({
        id: workflow.id,
        name: workflow.name,
        creator: workflow.user.name,
        downloads: workflow.downloads,
        purchases: workflow._count.purchases,
        averageRating:
          workflow.reviews.length > 0
            ? workflow.reviews.reduce((sum, r) => sum + r.rating, 0) /
              workflow.reviews.length
            : 0,
        totalReviews: workflow.reviews.length,
      })),
      summary: {
        totalWorkflows,
        totalSales: totalSales._sum.amount || 0,
        averageRating: averageRating._avg.rating || 0,
        period,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
