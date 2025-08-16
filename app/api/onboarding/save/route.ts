import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const buyerStep1Schema = z.object({
  step: z.literal("buyer-1"),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
});

const buyerStep2Schema = z.object({
  step: z.literal("buyer-2"),
  integrations: z.array(z.string()).optional(),
});

const buyerStep3Schema = z.object({
  step: z.literal("buyer-3"),
  completed: z.literal(true),
});

const sellerStep1Schema = z.object({
  step: z.literal("seller-1"),
  name: z.string().min(1, "Full name is required"),
  profession: z.string().min(1, "Profession is required"),
  experienceYears: z.number().min(0, "Experience years must be 0 or more"),
  organization: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

const sellerStep2Schema = z.object({
  step: z.literal("seller-2"),
  bankAccountName: z.string().min(1, "Bank account name is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  bankRoutingNumber: z.string().min(1, "Bank routing number is required"),
  paypalEmail: z.string().email().optional(),
});

const sellerStep3Schema = z.object({
  step: z.literal("seller-3"),
  verificationDocs: z
    .array(z.string())
    .min(1, "At least one verification document is required"),
});

const sellerStep4Schema = z.object({
  step: z.literal("seller-4"),
  completed: z.literal(true),
});

const onboardingSchema = z.discriminatedUnion("step", [
  buyerStep1Schema,
  buyerStep2Schema,
  buyerStep3Schema,
  sellerStep1Schema,
  sellerStep2Schema,
  sellerStep3Schema,
  sellerStep4Schema,
]);

// Helper function to convert step string to number
function getStepNumber(step: string): number {
  const stepMap: Record<string, number> = {
    "buyer-1": 1,
    "buyer-2": 2,
    "buyer-3": 3,
    "seller-1": 1,
    "seller-2": 2,
    "seller-3": 3,
    "seller-4": 4,
  };
  return stepMap[step] || 1;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    const updateData: any = {
      onboardingStep: getStepNumber(validatedData.step),
    };

    // Handle different step data based on user type and step
    if (validatedData.step === "buyer-1") {
      updateData.interests = validatedData.interests;
    } else if (validatedData.step === "buyer-2") {
      updateData.integrations = validatedData.integrations || [];
    } else if (validatedData.step === "buyer-3") {
      updateData.onboardingCompleted = true;
      updateData.onboardingStep = "buyer-1"; // Reset for next session
    } else if (validatedData.step === "seller-1") {
      updateData.name = validatedData.name;
      updateData.profession = validatedData.profession;
      updateData.experienceYears = validatedData.experienceYears;
      updateData.organizationId = validatedData.organization || null;
      updateData.website = validatedData.website || null;
    } else if (validatedData.step === "seller-2") {
      updateData.bankAccountName = validatedData.bankAccountName;
      updateData.bankAccountNumber = validatedData.bankAccountNumber;
      updateData.bankRoutingNumber = validatedData.bankRoutingNumber;
      updateData.paypalEmail = validatedData.paypalEmail || null;
    } else if (validatedData.step === "seller-3") {
      updateData.verificationDocs = validatedData.verificationDocs;
      // Create seller verification record
      await prisma.sellerVerification.upsert({
        where: { userId: session.user.id },
        update: {
          status: "PENDING",
          submittedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          status: "PENDING",
          submittedAt: new Date(),
        },
      });

      // Update user's seller verification status
      updateData.sellerVerificationStatus = "PENDING";
    } else if (validatedData.step === "seller-4") {
      updateData.onboardingCompleted = true;
      updateData.onboardingStep = "seller-1"; // Reset for next session
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        onboardingCompleted: updatedUser.onboardingCompleted,
        onboardingStep: updatedUser.onboardingStep,
        roles: updatedUser.roles,
        sellerVerificationStatus: updatedUser.sellerVerificationStatus,
        isSellerVerified: updatedUser.isSellerVerified,
      },
    });
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}
