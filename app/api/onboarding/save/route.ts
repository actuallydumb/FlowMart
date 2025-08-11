import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const buyerStep1Schema = z.object({
  step: z.literal(1),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
});

const buyerStep2Schema = z.object({
  step: z.literal(2),
  integrations: z.array(z.string()).optional(),
});

const buyerStep3Schema = z.object({
  step: z.literal(3),
  completed: z.literal(true),
});

const sellerStep1Schema = z.object({
  step: z.literal(1),
  name: z.string().min(1, "Full name is required"),
  profession: z.string().min(1, "Profession is required"),
  experienceYears: z.number().min(0, "Experience years must be 0 or more"),
  organization: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

const sellerStep2Schema = z.object({
  step: z.literal(2),
  bankAccountName: z.string().min(1, "Bank account name is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  bankRoutingNumber: z.string().min(1, "Bank routing number is required"),
  paypalEmail: z.string().email().optional(),
});

const sellerStep3Schema = z.object({
  step: z.literal(3),
  verificationDocs: z
    .array(z.string())
    .min(1, "At least one verification document is required"),
});

const sellerStep4Schema = z.object({
  step: z.literal(4),
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    const updateData: any = {
      onboardingStep: validatedData.step,
    };

    // Handle different step data based on user type and step
    if (validatedData.step === 1) {
      if ("interests" in validatedData) {
        // Buyer step 1
        updateData.interests = validatedData.interests;
      } else {
        // Seller step 1
        updateData.name = validatedData.name;
        updateData.profession = validatedData.profession;
        updateData.experienceYears = validatedData.experienceYears;
        updateData.organizationId = validatedData.organization || null;
        updateData.website = validatedData.website || null;
      }
    } else if (validatedData.step === 2) {
      if ("integrations" in validatedData) {
        // Buyer step 2
        updateData.integrations = validatedData.integrations || [];
      } else if ("bankAccountName" in validatedData) {
        // Seller step 2
        updateData.bankAccountName = validatedData.bankAccountName;
        updateData.bankAccountNumber = validatedData.bankAccountNumber;
        updateData.bankRoutingNumber = validatedData.bankRoutingNumber;
        updateData.paypalEmail = validatedData.paypalEmail || null;
      }
    } else if (validatedData.step === 3) {
      if ("completed" in validatedData && validatedData.completed) {
        // Buyer step 3 (completion)
        updateData.onboardingCompleted = true;
        updateData.onboardingStep = 1; // Reset for next session
      } else if ("verificationDocs" in validatedData) {
        // Seller step 3
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
      }
    } else if (
      validatedData.step === 4 &&
      "completed" in validatedData &&
      validatedData.completed
    ) {
      // Seller step 4 (completion)
      updateData.onboardingCompleted = true;
      updateData.onboardingStep = 1; // Reset for next session
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        onboardingCompleted: true,
        onboardingStep: true,
        roles: true,
        sellerVerificationStatus: true,
        isSellerVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
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
