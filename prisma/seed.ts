import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@workflowhub.com" },
    update: {},
    create: {
      email: "admin@workflowhub.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create sample developer
  const developer = await prisma.user.upsert({
    where: { email: "developer@example.com" },
    update: {},
    create: {
      email: "developer@example.com",
      name: "Sample Developer",
      role: "DEVELOPER",
    },
  });

  // Create sample buyer
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      email: "buyer@example.com",
      name: "Sample Buyer",
      role: "BUYER",
    },
  });

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: "Email" },
      update: {},
      create: { name: "Email" },
    }),
    prisma.tag.upsert({
      where: { name: "Marketing" },
      update: {},
      create: { name: "Marketing" },
    }),
    prisma.tag.upsert({
      where: { name: "Automation" },
      update: {},
      create: { name: "Automation" },
    }),
    prisma.tag.upsert({
      where: { name: "CRM" },
      update: {},
      create: { name: "CRM" },
    }),
    prisma.tag.upsert({
      where: { name: "Integration" },
      update: {},
      create: { name: "Integration" },
    }),
    prisma.tag.upsert({
      where: { name: "Data" },
      update: {},
      create: { name: "Data" },
    }),
  ]);

  // Create sample workflows
  const workflow1 = await prisma.workflow.upsert({
    where: { id: "sample-workflow-1" },
    update: {},
    create: {
      id: "sample-workflow-1",
      name: "Email Marketing Automation",
      description:
        "Complete email marketing workflow with segmentation, automation, and analytics tracking.",
      price: 29.99,
      fileUrl: "/workflows/email-marketing.json",
      status: "APPROVED",
      downloads: 156,
      userId: developer.id,
    },
  });

  const workflow2 = await prisma.workflow.upsert({
    where: { id: "sample-workflow-2" },
    update: {},
    create: {
      id: "sample-workflow-2",
      name: "CRM Integration Workflow",
      description:
        "Seamless integration between multiple CRM systems with data synchronization.",
      price: 49.99,
      fileUrl: "/workflows/crm-integration.json",
      status: "PENDING",
      downloads: 0,
      userId: developer.id,
    },
  });

  // Connect workflows to tags
  await prisma.workflow.update({
    where: { id: workflow1.id },
    data: {
      tags: {
        connect: [
          { name: "Email" },
          { name: "Marketing" },
          { name: "Automation" },
        ],
      },
    },
  });

  await prisma.workflow.update({
    where: { id: workflow2.id },
    data: {
      tags: {
        connect: [{ name: "CRM" }, { name: "Integration" }, { name: "Data" }],
      },
    },
  });

  // Create sample purchase
  const purchase = await prisma.purchase.upsert({
    where: { id: "sample-purchase-1" },
    update: {},
    create: {
      id: "sample-purchase-1",
      workflowId: workflow1.id,
      buyerId: buyer.id,
      amount: 29.99,
      status: "COMPLETED",
    },
  });

  // Create earnings record
  await prisma.earnings.upsert({
    where: { purchaseId: purchase.id },
    update: {},
    create: {
      developerId: developer.id,
      purchaseId: purchase.id,
      amount: 20.99, // 70% of 29.99
      status: "PENDING",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("👤 Admin user:", adminUser.email);
  console.log("👨‍💻 Developer:", developer.email);
  console.log("🛒 Buyer:", buyer.email);
  console.log("🏷️ Tags created:", tags.length);
  console.log("📦 Workflows created:", 2);
  console.log("💳 Sample purchase created");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
