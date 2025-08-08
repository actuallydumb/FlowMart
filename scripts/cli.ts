#!/usr/bin/env node

import { Command } from "commander";
import { prisma } from "../lib/db";
import { runtimeEngine } from "../lib/runtime-engine";
import { aiGenerator } from "../lib/ai-generator";
import fs from "fs";
import path from "path";

const program = new Command();

program
  .name("workflowhub-cli")
  .description("CLI tool for WorkflowHub management")
  .version("1.0.0");

// Workflow management commands
program
  .command("workflow:list")
  .description("List all workflows")
  .option("-u, --user <userId>", "Filter by user ID")
  .option("-s, --status <status>", "Filter by status")
  .action(async (options) => {
    try {
      const where: any = {};

      if (options.user) {
        where.userId = options.user;
      }

      if (options.status) {
        where.status = options.status;
      }

      const workflows = await prisma.workflow.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.table(
        workflows.map((w) => ({
          id: w.id,
          name: w.name,
          status: w.status,
          price: w.price,
          downloads: w.downloads,
          user: w.user.name,
          tags: w.tags.map((t) => t.name).join(", "),
          createdAt: w.createdAt.toISOString(),
        }))
      );
    } catch (error) {
      console.error("Error listing workflows:", error);
      process.exit(1);
    }
  });

program
  .command("workflow:execute <workflowId>")
  .description("Execute a workflow")
  .option("-i, --input <json>", "Input data as JSON")
  .option("-u, --user <userId>", "User ID to execute as")
  .action(async (workflowId, options) => {
    try {
      const input = options.input ? JSON.parse(options.input) : {};
      const userId = options.user || "cli-user";

      console.log(`Executing workflow ${workflowId}...`);

      const execution = await runtimeEngine.executeWorkflow(
        workflowId,
        userId,
        input
      );

      console.log("Execution completed:", {
        id: execution.id,
        status: execution.status,
        startedAt: execution.startedAt,
        completedAt: execution.completedAt,
        error: execution.error,
        result: execution.result,
      });
    } catch (error) {
      console.error("Error executing workflow:", error);
      process.exit(1);
    }
  });

program
  .command("workflow:logs <workflowId>")
  .description("Get workflow logs")
  .option("-l, --limit <number>", "Number of logs to fetch", "50")
  .option("-u, --user <userId>", "User ID")
  .action(async (workflowId, options) => {
    try {
      const userId = options.user || "cli-user";
      const limit = parseInt(options.limit);

      const logs = await runtimeEngine.getWorkflowLogs(
        workflowId,
        userId,
        limit,
        0
      );

      console.table(
        logs.map((log) => ({
          id: log.id,
          level: log.level,
          message: log.message,
          timestamp: log.timestamp.toISOString(),
          user: log.user.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching logs:", error);
      process.exit(1);
    }
  });

// AI generation commands
program
  .command("ai:generate")
  .description("Generate a workflow using AI")
  .option("-d, --description <text>", "Workflow description")
  .option("-t, --tags <tags>", "Comma-separated tags")
  .option("-u, --user <userId>", "User ID")
  .action(async (options) => {
    try {
      if (!options.description) {
        console.error("Description is required");
        process.exit(1);
      }

      const userId = options.user || "cli-user";
      const tags = options.tags ? options.tags.split(",") : [];

      console.log("Generating workflow with AI...");

      const workflow = await aiGenerator.generateWorkflowFromDescription(
        options.description,
        userId,
        tags
      );

      console.log("Workflow generated:", {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        price: workflow.price,
        status: workflow.status,
        tags: workflow.tags.map((t) => t.name).join(", "),
      });
    } catch (error) {
      console.error("Error generating workflow:", error);
      process.exit(1);
    }
  });

program
  .command("ai:suggestions")
  .description("Get AI workflow suggestions")
  .option("-u, --user <userId>", "User ID")
  .action(async (options) => {
    try {
      const userId = options.user || "cli-user";

      console.log("Generating workflow suggestions...");

      const suggestions = await aiGenerator.generateWorkflowSuggestions(userId);

      console.table(
        suggestions.map((s: any) => ({
          name: s.name,
          description: s.description,
          estimatedPrice: s.estimatedPrice,
          tags: s.tags.join(", "),
          reasoning: s.reasoning,
        }))
      );
    } catch (error) {
      console.error("Error generating suggestions:", error);
      process.exit(1);
    }
  });

// Database management commands
program
  .command("db:seed")
  .description("Seed the database with sample data")
  .action(async () => {
    try {
      console.log("Seeding database...");

      // Run the seed script
      const { execSync } = require("child_process");
      execSync("npm run db:seed", { stdio: "inherit" });

      console.log("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
      process.exit(1);
    }
  });

program
  .command("db:reset")
  .description("Reset the database (WARNING: This will delete all data)")
  .option("-f, --force", "Skip confirmation")
  .action(async (options) => {
    try {
      if (!options.force) {
        const readline = require("readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const answer = await new Promise((resolve) => {
          rl.question(
            "Are you sure you want to reset the database? This will delete ALL data! (yes/no): ",
            resolve
          );
        });

        rl.close();

        if ((answer as string).toLowerCase() !== "yes") {
          console.log("Database reset cancelled");
          return;
        }
      }

      console.log("Resetting database...");

      // Drop all tables and recreate
      await prisma.$executeRaw`DROP SCHEMA IF EXISTS public CASCADE`;
      await prisma.$executeRaw`CREATE SCHEMA public`;

      // Push schema
      const { execSync } = require("child_process");
      execSync("npm run db:push", { stdio: "inherit" });

      console.log("Database reset successfully!");
    } catch (error) {
      console.error("Error resetting database:", error);
      process.exit(1);
    }
  });

// Deployment commands
program
  .command("deploy:vercel")
  .description("Deploy to Vercel")
  .option("-e, --env <file>", "Environment file path")
  .action(async (options) => {
    try {
      console.log("Deploying to Vercel...");

      // Check if vercel CLI is installed
      const { execSync } = require("child_process");

      try {
        execSync("vercel --version", { stdio: "pipe" });
      } catch {
        console.error("Vercel CLI not found. Please install it first:");
        console.error("npm i -g vercel");
        process.exit(1);
      }

      // Deploy
      execSync("vercel --prod", { stdio: "inherit" });

      console.log("Deployed to Vercel successfully!");
    } catch (error) {
      console.error("Error deploying to Vercel:", error);
      process.exit(1);
    }
  });

program
  .command("deploy:fly")
  .description("Deploy to Fly.io")
  .option("-a, --app <name>", "App name")
  .action(async (options) => {
    try {
      console.log("Deploying to Fly.io...");

      const { execSync } = require("child_process");

      try {
        execSync("flyctl version", { stdio: "pipe" });
      } catch {
        console.error("Fly CLI not found. Please install it first:");
        console.error("curl -L https://fly.io/install.sh | sh");
        process.exit(1);
      }

      // Deploy
      const appName = options.app || "workflowhub";
      execSync(`flyctl deploy --app ${appName}`, { stdio: "inherit" });

      console.log("Deployed to Fly.io successfully!");
    } catch (error) {
      console.error("Error deploying to Fly.io:", error);
      process.exit(1);
    }
  });

// Health check command
program
  .command("health")
  .description("Check system health")
  .action(async () => {
    try {
      console.log("Checking system health...");

      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Database connection: OK");

      // Test rate limiting
      const { checkRateLimit, apiRateLimit } = require("../lib/rate-limit");
      const rateLimitResult = await checkRateLimit(
        "health-check",
        apiRateLimit
      );
      console.log("✅ Rate limiting: OK");

      // Test AI services (if configured)
      if (process.env.OPENAI_API_KEY) {
        console.log("✅ OpenAI API: Configured");
      } else {
        console.log("⚠️ OpenAI API: Not configured");
      }

      if (process.env.ANTHROPIC_API_KEY) {
        console.log("✅ Anthropic API: Configured");
      } else {
        console.log("⚠️ Anthropic API: Not configured");
      }

      // Test Stripe (if configured)
      if (process.env.STRIPE_SECRET_KEY) {
        console.log("✅ Stripe: Configured");
      } else {
        console.log("⚠️ Stripe: Not configured");
      }

      console.log("✅ System health check completed");
    } catch (error) {
      console.error("❌ Health check failed:", error);
      process.exit(1);
    }
  });

program.parse();
