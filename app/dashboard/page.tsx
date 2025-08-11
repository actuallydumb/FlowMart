"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowCard } from "@/components/workflow-card";
import { UploadWorkflowDialog } from "@/components/upload-workflow-dialog";
import { EditWorkflowDialog } from "@/components/edit-workflow-dialog";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload,
  DollarSign,
  Download,
  Package,
  Plus,
  ShoppingCart,
  Star,
  FileText,
  Edit,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { WorkflowWithUser, PurchaseWithWorkflow, hasRole } from "@/types";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [workflows, setWorkflows] = useState<WorkflowWithUser[]>([]);
  const [purchases, setPurchases] = useState<PurchaseWithWorkflow[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] =
    useState<WorkflowWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, [session]);

  const fetchDashboardData = async () => {
    if (!session?.user?.id) return;

    try {
      const [workflowsRes, purchasesRes] = await Promise.all([
        fetch("/api/workflows/my-workflows"),
        fetch("/api/purchases/my-purchases"),
      ]);

      if (workflowsRes.ok) {
        const workflowsData = await workflowsRes.json();
        setWorkflows(workflowsData);
      }

      if (purchasesRes.ok) {
        const purchasesData = await purchasesRes.json();
        setPurchases(purchasesData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const approvedWorkflows = workflows.filter((w) => w.status === "APPROVED");
  const pendingWorkflows = workflows.filter((w) => w.status === "PENDING");
  const totalEarnings = approvedWorkflows.reduce(
    (sum, w) => sum + w.price * w.downloads * 0.7,
    0
  );
  const totalDownloads = approvedWorkflows.reduce(
    (sum, w) => sum + w.downloads,
    0
  );

  const isDeveloper =
    session?.user?.roles && hasRole(session.user.roles, "DEVELOPER");
  const isBuyer = session?.user?.roles && hasRole(session.user.roles, "BUYER");
  const isAdmin = session?.user?.roles && hasRole(session.user.roles, "ADMIN");

  const handleEditWorkflow = (workflow: WorkflowWithUser) => {
    setEditingWorkflow(workflow);
    setIsEditDialogOpen(true);
  };

  const handleWorkflowUpdated = (updatedWorkflow: WorkflowWithUser) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w))
    );
    toast.success("Workflow updated successfully!");
  };

  const handleWorkflowUploaded = (newWorkflow: WorkflowWithUser) => {
    setWorkflows((prev) => [newWorkflow, ...prev]);
    setIsUploadDialogOpen(false);
    toast.success("Workflow uploaded successfully!");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session?.user?.name}
            </p>
            {session?.user?.roles && (
              <p className="text-sm text-muted-foreground">
                Roles: {session.user.roles.join(", ")}
              </p>
            )}
          </div>
          {isDeveloper && (
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Workflow
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {isDeveloper && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>
        )}

        {isDeveloper && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDownloads}</div>
              <p className="text-xs text-muted-foreground">
                Across all workflows
              </p>
            </CardContent>
          </Card>
        )}

        {isDeveloper && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Workflows
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvedWorkflows.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {pendingWorkflows.length} pending approval
              </p>
            </CardContent>
          </Card>
        )}

        {isBuyer && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Purchased Workflows
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
              <p className="text-xs text-muted-foreground">Total purchases</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dashboard Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="developer" disabled={!isDeveloper}>
            Developer ({isDeveloper ? workflows.length : 0})
          </TabsTrigger>
          <TabsTrigger value="buyer" disabled={!isBuyer}>
            Buyer ({purchases.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Analytics */}
        <TabsContent value="overview" className="space-y-6">
          {(isDeveloper || isAdmin) && <AnalyticsCharts />}
          {!isDeveloper && !isAdmin && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Analytics are available for developers and admins
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Developer Tab */}
        {isDeveloper && (
          <TabsContent value="developer" className="space-y-6">
            <Tabs defaultValue="active" className="space-y-6">
              <TabsList>
                <TabsTrigger value="active">
                  Active Workflows ({approvedWorkflows.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending Approval ({pendingWorkflows.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {approvedWorkflows.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedWorkflows.map((workflow) => (
                      <WorkflowCard
                        key={workflow.id}
                        workflow={workflow}
                        isOwner={true}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Active Workflows
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Upload your first workflow to start earning
                      </p>
                      <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Workflow
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {pendingWorkflows.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingWorkflows.map((workflow) => (
                      <Card
                        key={workflow.id}
                        className="group hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {workflow.name}
                            </CardTitle>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                          <CardDescription>
                            {workflow.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-primary">
                              ${workflow.price}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditWorkflow(workflow)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {workflow.tags.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <p className="text-muted-foreground">
                        No workflows pending approval
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        )}

        {/* Buyer Tab */}
        {isBuyer && (
          <TabsContent value="buyer" className="space-y-4">
            {purchases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((purchase) => (
                  <Card
                    key={purchase.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {purchase.workflow.name}
                        </CardTitle>
                        <Badge variant="default">Purchased</Badge>
                      </div>
                      <CardDescription>
                        {purchase.workflow.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ${purchase.amount}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Purchased Workflows
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring the marketplace to find workflows
                  </p>
                  <Button asChild>
                    <a href="/marketplace">Browse Marketplace</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Dialogs */}
      <UploadWorkflowDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onWorkflowUploaded={handleWorkflowUploaded}
      />

      <EditWorkflowDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        workflow={editingWorkflow}
        onWorkflowUpdated={handleWorkflowUpdated}
      />
    </div>
  );
}
