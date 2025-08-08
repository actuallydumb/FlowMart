import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { workflowSchema } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export class AIGenerator {
  async generateWorkflowFromDescription(
    description: string,
    userId: string,
    tags: string[] = []
  ) {
    try {
      // Generate workflow using OpenAI
      const workflowCode = await this.generateWorkflowCode(description);

      // Generate workflow metadata
      const metadata = await this.generateWorkflowMetadata(description, tags);

      // Create workflow in database
      const workflow = await prisma.workflow.create({
        data: {
          name: metadata.name,
          description: metadata.description,
          price: metadata.price,
          fileUrl: workflowCode.fileUrl,
          status: "PENDING",
          userId,
          tags: {
            connectOrCreate: metadata.tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return workflow;
    } catch (error) {
      console.error("Error generating workflow:", error);
      throw new Error("Failed to generate workflow");
    }
  }

  private async generateWorkflowCode(description: string) {
    const prompt = `
You are an expert automation workflow developer. Create a JavaScript workflow based on this description:

${description}

The workflow should:
1. Be safe and sandboxed
2. Handle errors gracefully
3. Include proper logging
4. Be well-documented
5. Follow best practices

Return only the JavaScript code, no explanations.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert automation workflow developer. Generate only JavaScript code, no explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const code = completion.choices[0]?.message?.content || "";

    // In a real implementation, you would save this to a file
    // For now, we'll return a mock file URL
    return {
      fileUrl: `/workflows/generated-${Date.now()}.js`,
      code,
    };
  }

  private async generateWorkflowMetadata(description: string, tags: string[]) {
    const prompt = `
Generate metadata for a workflow based on this description:

${description}

Available tags: ${tags.join(", ")}

Return a JSON object with:
- name: A concise, descriptive name
- description: A detailed description
- price: A reasonable price (number between 0 and 100)
- tags: Array of relevant tags from the available list

Example:
{
  "name": "Email Marketing Automation",
  "description": "Automated email marketing workflow with segmentation and analytics",
  "price": 29.99,
  "tags": ["Email", "Marketing", "Automation"]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at creating workflow metadata. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "{}";

    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback metadata
      return {
        name: "Generated Workflow",
        description: description,
        price: 19.99,
        tags: tags.length > 0 ? tags : ["Automation"],
      };
    }
  }

  async enhanceWorkflowWithAI(workflowId: string, enhancement: string) {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { tags: true },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    const prompt = `
Enhance this workflow based on the request:

Current workflow: ${workflow.description}
Enhancement request: ${enhancement}

Generate an improved version of the workflow code that incorporates the enhancement.
Return only the JavaScript code, no explanations.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert automation workflow developer. Generate only JavaScript code, no explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const enhancedCode = completion.choices[0]?.message?.content || "";

    // Create a new version of the workflow
    const newVersion = await prisma.workflowVersion.create({
      data: {
        version: workflow.version + 1,
        name: workflow.name,
        description: workflow.description,
        fileUrl: `/workflows/enhanced-${workflowId}-${Date.now()}.js`,
        changelog: `AI enhancement: ${enhancement}`,
        workflowId,
        createdById: workflow.userId,
      },
    });

    // Update workflow version
    await prisma.workflow.update({
      where: { id: workflowId },
      data: { version: workflow.version + 1 },
    });

    return newVersion;
  }

  async generateWorkflowSuggestions(userId: string) {
    const userWorkflows = await prisma.workflow.findMany({
      where: { userId },
      include: { tags: true },
    });

    const prompt = `
Based on the user's existing workflows, suggest new workflow ideas:

Existing workflows:
${userWorkflows.map((w) => `- ${w.name}: ${w.description}`).join("\n")}

Generate 5 workflow suggestions that would complement their existing portfolio.
Return a JSON array with objects containing:
- name: Workflow name
- description: Brief description
- estimatedPrice: Estimated price
- tags: Array of relevant tags
- reasoning: Why this workflow would be valuable

Example:
[
  {
    "name": "Social Media Analytics",
    "description": "Automated social media performance tracking and reporting",
    "estimatedPrice": 24.99,
    "tags": ["Social Media", "Analytics"],
    "reasoning": "Complements existing marketing workflows"
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at suggesting automation workflows. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || "[]";

    try {
      return JSON.parse(response);
    } catch (error) {
      return [];
    }
  }
}

export const aiGenerator = new AIGenerator();
