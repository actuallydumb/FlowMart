const { PrismaClient } = require("@prisma/client");

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
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8i.", // "password123"
      roles: ["ADMIN"],
      onboardingCompleted: true,
      onboardingStep: 1,
      isSellerVerified: true,
      sellerVerificationStatus: "APPROVED",
    },
  });

  // Create developer user
  const developer = await prisma.user.upsert({
    where: { email: "developer@workflowhub.com" },
    update: {},
    create: {
      email: "developer@workflowhub.com",
      name: "John Developer",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8i.", // "password123"
      roles: ["DEVELOPER"],
      onboardingCompleted: true,
      onboardingStep: 1,
      profession: "Software Developer",
      experienceYears: 5,
      isSellerVerified: true,
      sellerVerificationStatus: "APPROVED",
    },
  });

  // Create buyer user
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@workflowhub.com" },
    update: {},
    create: {
      email: "buyer@workflowhub.com",
      name: "Jane Buyer",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8i.", // "password123"
      roles: ["BUYER"],
      onboardingCompleted: true,
      onboardingStep: 1,
      interests: ["automation", "productivity", "marketing"],
      integrations: ["slack", "notion"],
    },
  });

  // Create multi-role user
  const multiRoleUser = await prisma.user.upsert({
    where: { email: "multiuser@workflowhub.com" },
    update: {},
    create: {
      email: "multiuser@workflowhub.com",
      name: "Multi User",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8i.", // "password123"
      roles: ["DEVELOPER", "BUYER"],
      onboardingCompleted: true,
      onboardingStep: 1,
      profession: "Product Manager",
      experienceYears: 3,
      interests: ["development", "analytics"],
      integrations: ["github", "figma"],
      isSellerVerified: true,
      sellerVerificationStatus: "APPROVED",
    },
  });

  // Create tags
  const emailTag = await prisma.tag.upsert({
    where: { name: "Email" },
    update: {},
    create: { name: "Email" },
  });

  const automationTag = await prisma.tag.upsert({
    where: { name: "Automation" },
    update: {},
    create: { name: "Automation" },
  });

  const marketingTag = await prisma.tag.upsert({
    where: { name: "Marketing" },
    update: {},
    create: { name: "Marketing" },
  });

  const crmTag = await prisma.tag.upsert({
    where: { name: "CRM" },
    update: {},
    create: { name: "CRM" },
  });

  // Create sample workflows with new fields
  const emailWorkflow = await prisma.workflow.upsert({
    where: { id: "email-workflow-1" },
    update: {},
    create: {
      id: "email-workflow-1",
      name: "Email Marketing Automation",
      description:
        "Automate your email marketing campaigns with this comprehensive workflow. Includes segmentation, A/B testing, and analytics tracking.",
      price: 49.99,
      fileUrl: "https://example.com/email-workflow.json",
      prerequisites:
        "1. Set up your email service provider API keys\n2. Configure your email templates\n3. Set up your subscriber list\n4. Ensure GDPR compliance for your region",
      documentation:
        "## Getting Started\n\n1. **Install Dependencies**\n   - Run `npm install` to install required packages\n   - Configure your environment variables\n\n2. **Setup Configuration**\n   - Add your API keys to the config file\n   - Set up your email templates\n   - Configure your subscriber segments\n\n3. **Run the Workflow**\n   - Execute the main workflow file\n   - Monitor the dashboard for results\n   - Review analytics and optimize\n\n## Features\n- Automated email scheduling\n- A/B testing capabilities\n- Subscriber segmentation\n- Analytics and reporting\n- GDPR compliance tools",
      mediaUrls: [
        "https://example.com/email-workflow-screenshot1.jpg",
        "https://example.com/email-workflow-screenshot2.jpg",
        "https://example.com/email-workflow-dashboard.png",
      ],
      videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      status: "APPROVED",
      downloads: 150,
      isPublic: true,
      isFeatured: true,
      userId: developer.id,
      tags: {
        connect: [emailTag.id, automationTag.id, marketingTag.id],
      },
    },
  });

  const crmWorkflow = await prisma.workflow.upsert({
    where: { id: "crm-workflow-1" },
    update: {},
    create: {
      id: "crm-workflow-1",
      name: "CRM Lead Management",
      description:
        "Streamline your customer relationship management with this automated lead tracking and follow-up workflow.",
      price: 39.99,
      fileUrl: "https://example.com/crm-workflow.json",
      prerequisites:
        "1. CRM system access (Salesforce, HubSpot, etc.)\n2. Email integration setup\n3. Lead scoring criteria defined",
      documentation:
        "## Installation\n\n1. **System Requirements**\n   - Node.js 16+ installed\n   - Access to your CRM system\n   - Email service configured\n\n2. **Configuration Steps**\n   - Update the config.json with your CRM credentials\n   - Set up your lead scoring rules\n   - Configure email templates\n\n3. **Usage**\n   - The workflow automatically processes new leads\n   - Sends follow-up emails based on lead score\n   - Updates CRM records with interaction data\n\n## Benefits\n- Automated lead scoring\n- Timely follow-up emails\n- CRM data synchronization\n- Performance analytics",
      mediaUrls: [
        "https://example.com/crm-workflow-overview.jpg",
        "https://example.com/crm-workflow-dashboard.jpg",
      ],
      status: "APPROVED",
      downloads: 89,
      isPublic: true,
      userId: developer.id,
      tags: {
        connect: [crmTag.id, automationTag.id],
      },
    },
  });

  const basicWorkflow = await prisma.workflow.upsert({
    where: { id: "basic-workflow-1" },
    update: {},
    create: {
      id: "basic-workflow-1",
      name: "Basic Task Automation",
      description:
        "A simple workflow for automating repetitive tasks. Perfect for beginners.",
      price: 19.99,
      fileUrl: "https://example.com/basic-workflow.json",
      status: "APPROVED",
      downloads: 45,
      isPublic: true,
      userId: multiRoleUser.id,
      tags: {
        connect: [automationTag.id],
      },
    },
  });

  // Create sample purchases
  const purchase1 = await prisma.purchase.upsert({
    where: { id: "purchase-1" },
    update: {},
    create: {
      id: "purchase-1",
      workflowId: emailWorkflow.id,
      buyerId: buyer.id,
      amount: emailWorkflow.price,
      status: "COMPLETED",
    },
  });

  const purchase2 = await prisma.purchase.upsert({
    where: { id: "purchase-2" },
    update: {},
    create: {
      id: "purchase-2",
      workflowId: crmWorkflow.id,
      buyerId: buyer.id,
      amount: crmWorkflow.price,
      status: "COMPLETED",
    },
  });

  const purchase3 = await prisma.purchase.upsert({
    where: { id: "purchase-3" },
    update: {},
    create: {
      id: "purchase-3",
      workflowId: basicWorkflow.id,
      buyerId: multiRoleUser.id,
      amount: basicWorkflow.price,
      status: "COMPLETED",
    },
  });

  // Create sample reviews
  const review1 = await prisma.workflowReview.upsert({
    where: { id: "review-1" },
    update: {},
    create: {
      id: "review-1",
      workflowId: emailWorkflow.id,
      userId: buyer.id,
      rating: 5,
      reviewText:
        "Excellent workflow! The email automation features are exactly what I needed. The documentation is clear and the setup was straightforward.",
    },
  });

  const review2 = await prisma.workflowReview.upsert({
    where: { id: "review-2" },
    update: {},
    create: {
      id: "review-2",
      workflowId: crmWorkflow.id,
      userId: buyer.id,
      rating: 4,
      reviewText:
        "Great CRM workflow. It saved me hours of manual work. The lead scoring feature is particularly useful.",
    },
  });

  const review3 = await prisma.workflowReview.upsert({
    where: { id: "review-3" },
    update: {},
    create: {
      id: "review-3",
      workflowId: basicWorkflow.id,
      userId: multiRoleUser.id,
      rating: 5,
      reviewText:
        "Perfect for getting started with automation. Simple but effective!",
    },
  });

  // Create earnings records
  const earnings1 = await prisma.earnings.upsert({
    where: { id: "earnings-1" },
    update: {},
    create: {
      id: "earnings-1",
      purchaseId: purchase1.id,
      amount: emailWorkflow.price * 0.7, // 70% to developer
      status: "PENDING",
    },
  });

  const earnings2 = await prisma.earnings.upsert({
    where: { id: "earnings-2" },
    update: {},
    create: {
      id: "earnings-2",
      purchaseId: purchase2.id,
      amount: crmWorkflow.price * 0.7,
      status: "PENDING",
    },
  });

  const earnings3 = await prisma.earnings.upsert({
    where: { id: "earnings-3" },
    update: {},
    create: {
      id: "earnings-3",
      purchaseId: purchase3.id,
      amount: basicWorkflow.price * 0.7,
      status: "PENDING",
    },
  });

  // Create sample blog posts
  const blogs = await Promise.all([
    prisma.blog.upsert({
      where: { slug: "getting-started-with-workflow-automation" },
      update: {},
      create: {
        title: "Getting Started with Workflow Automation",
        slug: "getting-started-with-workflow-automation",
        excerpt:
          "Learn the basics of workflow automation and how to choose the right tools for your business needs.",
        content: `
# Getting Started with Workflow Automation

Workflow automation is transforming how businesses operate. In this comprehensive guide, we'll explore the fundamentals of automation and help you get started on your automation journey.

## What is Workflow Automation?

Workflow automation is the process of using technology to execute recurring tasks or processes without human intervention. This can range from simple email automation to complex enterprise integrations.

## Benefits of Automation

- **Increased Efficiency**: Automate repetitive tasks to save time
- **Reduced Errors**: Eliminate human error in routine processes
- **Cost Savings**: Reduce operational costs through automation
- **Scalability**: Handle increased workload without proportional resource increase

## Popular Automation Tools

1. **n8n**: Open-source workflow automation tool
2. **Zapier**: Connect apps and automate workflows
3. **Make (Integromat)**: Visual workflow builder
4. **Microsoft Power Automate**: Enterprise automation platform

## Getting Started

1. Identify repetitive tasks in your workflow
2. Choose the right automation tool
3. Start with simple automations
4. Gradually scale up to complex workflows

Ready to start automating? Explore our marketplace for ready-to-use workflows!
        `,
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        published: true,
      },
    }),
    prisma.blog.upsert({
      where: { slug: "top-10-workflow-automation-trends-2024" },
      update: {},
      create: {
        title: "Top 10 Workflow Automation Trends for 2024",
        slug: "top-10-workflow-automation-trends-2024",
        excerpt:
          "Discover the latest trends shaping the future of workflow automation and how they'll impact your business.",
        content: `
# Top 10 Workflow Automation Trends for 2024

The automation landscape is evolving rapidly. Here are the top trends that will dominate workflow automation in 2024.

## 1. AI-Powered Automation

Artificial Intelligence is revolutionizing how we create and manage workflows. AI can now:
- Automatically generate workflows based on natural language descriptions
- Optimize existing workflows for better performance
- Predict and prevent workflow failures

## 2. Low-Code/No-Code Platforms

The democratization of automation continues with intuitive drag-and-drop interfaces that make automation accessible to non-technical users.

## 3. Hyperautomation

Combining multiple automation technologies (RPA, AI, ML) to create end-to-end automated processes.

## 4. Edge Computing Integration

Automation is moving closer to data sources, reducing latency and improving real-time processing capabilities.

## 5. Enhanced Security

As automation becomes more prevalent, security features are becoming more sophisticated to protect sensitive data and processes.

## 6. Citizen Developers

The rise of citizen developers - business users who create automation solutions without formal programming training.

## 7. API-First Approach

APIs are becoming the backbone of modern automation, enabling seamless integration between different systems and platforms.

## 8. Real-Time Analytics

Advanced analytics and monitoring capabilities provide insights into automation performance and optimization opportunities.

## 9. Sustainability Focus

Automation is being used to reduce environmental impact and promote sustainable business practices.

## 10. Hybrid Work Support

Automation solutions are adapting to support hybrid work environments and distributed teams.

Stay ahead of the curve by embracing these trends and exploring our marketplace for cutting-edge automation solutions.
        `,
        image:
          "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800",
        published: true,
      },
    }),
    prisma.blog.upsert({
      where: { slug: "how-to-monetize-your-automation-workflows" },
      update: {},
      create: {
        title: "How to Monetize Your Automation Workflows",
        slug: "how-to-monetize-your-automation-workflows",
        excerpt:
          "Turn your automation expertise into a profitable business by selling workflows on our marketplace.",
        content: `
# How to Monetize Your Automation Workflows

Transform your automation skills into a sustainable income stream. Learn how to create, package, and sell workflows that solve real business problems.

## Why Sell Workflows?

The automation market is booming, and businesses are actively seeking solutions to streamline their operations. By selling workflows, you can:
- Generate passive income
- Build a reputation in the automation community
- Help businesses solve real problems
- Scale your impact globally

## Creating Marketable Workflows

### 1. Identify Market Needs
Research common business challenges and pain points that automation can solve. Focus on:
- High-demand processes (email marketing, data processing, customer service)
- Industry-specific workflows
- Integration solutions

### 2. Design for Usability
Create workflows that are:
- Easy to understand and implement
- Well-documented with clear instructions
- Flexible and customizable
- Reliable and tested

### 3. Package Your Solution
Include:
- Detailed documentation
- Video tutorials
- Prerequisites and setup instructions
- Support resources

## Pricing Strategies

### 1. Value-Based Pricing
Price based on the value your workflow provides, not just development time.

### 2. Tiered Pricing
Offer different versions (basic, pro, enterprise) to capture different market segments.

### 3. Subscription Models
Consider recurring revenue models for ongoing value delivery.

## Marketing Your Workflows

### 1. Optimize Your Listings
- Clear, compelling titles
- Detailed descriptions
- High-quality screenshots and videos
- Customer testimonials

### 2. Build Your Brand
- Create a professional profile
- Engage with the community
- Provide excellent customer support
- Collect and showcase reviews

### 3. Leverage Social Proof
- Encourage customer reviews
- Share success stories
- Create case studies
- Build a portfolio

## Best Practices for Success

1. **Start Small**: Begin with simple, high-demand workflows
2. **Listen to Customers**: Gather feedback and iterate
3. **Stay Updated**: Keep up with automation trends and tools
4. **Network**: Connect with other developers and potential customers
5. **Quality Over Quantity**: Focus on creating excellent workflows rather than many mediocre ones

## Getting Started on WorkflowKart

1. Create your developer account
2. Upload your first workflow
3. Set competitive pricing
4. Promote your work
5. Engage with customers

Ready to start monetizing your automation skills? Join our marketplace today!
        `,
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        published: true,
      },
    }),
  ]);

  // Create sample testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.upsert({
      where: { id: "testimonial-1" },
      update: {},
      create: {
        id: "testimonial-1",
        name: "Sarah Chen",
        role: "CTO",
        company: "TechFlow Inc",
        quote:
          "WorkflowKart has transformed how we handle automation. The marketplace is incredible and the quality of workflows is outstanding.",
        avatar: "SC",
        rating: 5,
        published: true,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: "testimonial-2" },
      update: {},
      create: {
        id: "testimonial-2",
        name: "Mike Rodriguez",
        role: "Automation Developer",
        company: "Freelance",
        quote:
          "As a developer, I've earned over $50K selling my automation workflows. The platform is developer-friendly and payments are reliable.",
        avatar: "MR",
        rating: 5,
        published: true,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: "testimonial-3" },
      update: {},
      create: {
        id: "testimonial-3",
        name: "Alex Thompson",
        role: "Product Manager",
        company: "DataSync",
        quote:
          "The workflow marketplace saved us weeks of development time. We found exactly what we needed and it worked perfectly.",
        avatar: "AT",
        rating: 5,
        published: true,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: "testimonial-4" },
      update: {},
      create: {
        id: "testimonial-4",
        name: "Emily Watson",
        role: "Operations Director",
        company: "ScaleUp Solutions",
        quote:
          "The AI-powered workflow generation feature is a game-changer. It helped us automate processes we didn't even know could be automated.",
        avatar: "EW",
        rating: 5,
        published: true,
      },
    }),
  ]);

  // Create sample seller verifications
  const sellerVerifications = await Promise.all([
    prisma.sellerVerification.upsert({
      where: { userId: "user-2" },
      update: {},
      create: {
        userId: "user-2",
        status: "APPROVED",
        submittedAt: new Date("2024-01-15"),
        reviewedAt: new Date("2024-01-16"),
        reviewedBy: "user-1",
        notes: "Approved - Good portfolio and experience",
      },
    }),
    prisma.sellerVerification.upsert({
      where: { userId: "user-3" },
      update: {},
      create: {
        userId: "user-3",
        status: "PENDING",
        submittedAt: new Date("2024-01-20"),
        notes: "Application under review",
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`👥 Created ${4} users`);
  console.log(`🏷️  Created ${4} tags`);
  console.log(`⚡ Created ${3} workflows`);
  console.log(`💰 Created ${3} purchases`);
  console.log(`⭐ Created ${3} reviews`);
  console.log(`💵 Created ${3} earnings records`);
  console.log(`📝 Created ${blogs.length} blog posts`);
  console.log(`💬 Created ${testimonials.length} testimonials`);
  console.log(`👨‍💼 Created ${sellerVerifications.length} seller verifications`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
