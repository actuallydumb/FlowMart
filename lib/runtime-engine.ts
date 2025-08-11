import { prisma } from "@/lib/db";
import { checkRateLimit, executionRateLimit } from "@/lib/rate-limit";
import { WorkflowExecution, ExecutionStatus } from "@/types";

export class RuntimeEngine {
  private timeout: number = 30000; // 30 seconds

  private log(level: string, ...args: any[]) {
    console.log(`[RuntimeEngine] ${level}:`, ...args);
  }

  async executeWorkflow(
    workflowId: string,
    userId: string,
    input?: any
  ): Promise<WorkflowExecution> {
    // Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        executedById: userId,
        status: "PENDING",
      },
      include: {
        workflow: true,
        executedBy: true,
      },
    });

    try {
      // Update status to running
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: { status: "RUNNING" },
      });

      // Get workflow file
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: { user: true },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      // Check if user has access to workflow
      const hasAccess = await this.checkWorkflowAccess(workflowId, userId);
      if (!hasAccess) {
        throw new Error("Access denied to workflow");
      }

      // Rate limiting check
      const rateLimitResult = await checkRateLimit(
        `execution:${userId}`,
        executionRateLimit
      );
      if (!rateLimitResult.success) {
        throw new Error("Execution rate limit exceeded");
      }

      // Execute workflow in safe environment
      const result = await this.executeInSafeEnvironment(
        workflow.fileUrl,
        input
      );

      // Update execution with success
      const updatedExecution = await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          result: result,
        },
        include: {
          workflow: true,
          executedBy: true,
        },
      });

      // Log execution
      await prisma.workflowLog.create({
        data: {
          workflowId,
          userId,
          level: "INFO",
          message: "Workflow executed successfully",
          metadata: { executionId: execution.id, result },
        },
      });

      return {
        ...updatedExecution,
        completedAt: updatedExecution.completedAt || undefined,
        error: updatedExecution.error || undefined,
        executedBy: {
          ...updatedExecution.executedBy,
          name: updatedExecution.executedBy.name || "Unknown User",
        },
      };
    } catch (error) {
      // Update execution with error
      const updatedExecution = await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
        include: {
          workflow: true,
          executedBy: true,
        },
      });

      // Log error
      await prisma.workflowLog.create({
        data: {
          workflowId,
          userId,
          level: "ERROR",
          message: "Workflow execution failed",
          metadata: {
            executionId: execution.id,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        },
      });

      throw error;
    }
  }

  private async executeInSafeEnvironment(
    workflowFileUrl: string,
    input?: any
  ): Promise<any> {
    // In a real implementation, you would:
    // 1. Fetch the workflow file
    // 2. Parse and validate the workflow
    // 3. Execute it in a controlled environment
    // 4. Return the results

    // For now, we'll simulate workflow execution
    return new Promise((resolve, reject) => {
      try {
        // Simulate processing time
        setTimeout(() => {
          const result = {
            success: true,
            data: input || {},
            timestamp: new Date().toISOString(),
            workflowFile: workflowFileUrl,
            executionTime: Date.now(),
          };

          this.log("INFO", "Workflow executed with input:", input);
          resolve(result);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async checkWorkflowAccess(
    workflowId: string,
    userId: string
  ): Promise<boolean> {
    // Check if user owns the workflow
    const ownedWorkflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        userId,
      },
    });

    if (ownedWorkflow) {
      return true;
    }

    // Check if user has purchased the workflow
    const purchase = await prisma.purchase.findFirst({
      where: {
        workflowId,
        buyerId: userId,
        status: "COMPLETED",
      },
    });

    if (purchase) {
      return true;
    }

    // Check if workflow is public
    const publicWorkflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        isPublic: true,
        status: "APPROVED",
      },
    });

    return !!publicWorkflow;
  }

  async getWorkflowExecutions(
    workflowId: string,
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<WorkflowExecution[]> {
    const executions = await prisma.workflowExecution.findMany({
      where: {
        workflowId,
        executedById: userId,
      },
      include: {
        workflow: true,
        executedBy: true,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    return executions.map((execution) => ({
      ...execution,
      completedAt: execution.completedAt || undefined,
      error: execution.error || undefined,
      executedBy: {
        ...execution.executedBy,
        name: execution.executedBy.name || "Unknown User",
      },
    }));
  }

  async getWorkflowLogs(
    workflowId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    const logs = await prisma.workflowLog.findMany({
      where: {
        workflowId,
        userId,
      },
      include: {
        workflow: true,
        user: true,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
      skip: offset,
    });

    return logs;
  }
}

export const runtimeEngine = new RuntimeEngine();
