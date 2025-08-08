import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { email, password } = await request.json();

    // Find the existing user with email/password
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser || !existingUser.password) {
      return NextResponse.json(
        { error: "No account found with this email and password" },
        { status: 400 }
      );
    }

    // Update the existing user to link with the OAuth account
    await prisma.user.update({
      where: { email },
      data: {
        // Keep the existing password and other data
        // The OAuth account will be linked via NextAuth
      },
    });

    return NextResponse.json(
      { message: "Account linked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error linking account:", error);
    return NextResponse.json(
      { error: "Failed to link account" },
      { status: 500 }
    );
  }
} 