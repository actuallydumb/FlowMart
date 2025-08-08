"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Users,
  Package,
  DollarSign,
  Eye,
  Download,
} from "lucide-react";
import { WorkflowWithUser } from "@/types";

const mockPendingWorkflows: WorkflowWithUser[] = [
  {
    id: "1",
    name: "CRM Integration Workflow",
    description:
      "Seamless integration between multiple CRM systems with data synchronization.",
    price: 49.99,
    fileUrl: "/workflows/crm-integration.json",
    status: "PENDING",
    downloads: 0,
    isPublic: false,
    isFeatured: false,
    version: 1,
    createdAt: new Date(),
    user: {
      id: "2",
      name: "Mike Rodriguez",
      image: "https://github.com/shadcn.png",
    },
    tags: [
      { id: "4", name: "CRM" },
      { id: "5", name: "Integration" },
      { id: "6", name: "Data" },
    ],
  },
  {
    id: "2",
    name: "E-commerce Analytics",
    description:
      "Comprehensive analytics workflow for e-commerce platforms with sales tracking.",
    price: 39.99,
    fileUrl: "/workflows/ecommerce-analytics.json",
    status: "PENDING",
    downloads: 0,
    isPublic: false,
    isFeatured: false,
    version: 1,
    createdAt: new Date(),
    user: {
      id: "3",
      name: "Alex Thompson",
      image: "https://github.com/shadcn.png",
    },
    tags: [
      { id: "7", name: "E-commerce" },
      { id: "8", name: "Analytics" },
      { id: "9", name: "Sales" },
    ],
  },
];

const mockUsers = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "DEVELOPER",
    workflows: 3,
    earnings: 1250.5,
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    email: "mike@example.com",
    role: "DEVELOPER",
    workflows: 1,
    earnings: 0,
  },
  {
    id: "3",
    name: "Alex Thompson",
    email: "alex@example.com",
    role: "BUYER",
    workflows: 0,
    earnings: 0,
  },
];

export default function AdminPage() {
  const { data: session } = useSession();
  const [pendingWorkflows, setPendingWorkflows] =
    useState(mockPendingWorkflows);
  const [users] = useState(mockUsers);

  const handleApprove = (workflowId: string) => {
    setPendingWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
    // TODO: Update workflow status in database
  };

  const handleReject = (workflowId: string) => {
    setPendingWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
    // TODO: Update workflow status in database
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage workflows, users, and platform settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingWorkflows.length}</div>
            <p className="text-xs text-muted-foreground">
              Workflows awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Active platform users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workflows
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Approved workflows</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">
            Pending Workflows ({pendingWorkflows.length})
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {pendingWorkflows.length > 0 ? (
            <div className="space-y-4">
              {pendingWorkflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {workflow.name}
                        </CardTitle>
                        <CardDescription className="mb-3">
                          {workflow.description}
                        </CardDescription>
                        <div className="flex items-center space-x-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={workflow.user.image || ""} />
                            <AvatarFallback className="text-xs">
                              {workflow.user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {workflow.user.name}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {workflow.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="secondary">Pending</Badge>
                        <div className="text-2xl font-bold text-primary">
                          ${workflow.price}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(workflow.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(workflow.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Pending Reviews
                </h3>
                <p className="text-muted-foreground">
                  All workflows have been reviewed
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.workflows} workflows • $
                          {user.earnings.toFixed(2)} earned
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
