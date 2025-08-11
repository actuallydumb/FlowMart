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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Check,
  X,
  Users,
  Package,
  Shield,
  Edit,
  Eye,
  User,
  Calendar,
  Mail,
  Building,
} from "lucide-react";
import { WorkflowWithUser, hasRole } from "@/types";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  roles: string[];
  createdAt: string;
  _count: {
    workflows: number;
    purchases: number;
  };
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [pendingWorkflows, setPendingWorkflows] = useState<WorkflowWithUser[]>(
    []
  );
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingRoles, setEditingRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workflowsRes, usersRes] = await Promise.all([
        fetch("/api/admin/workflows/pending"),
        fetch("/api/admin/users"),
      ]);

      if (workflowsRes.ok) {
        const data = await workflowsRes.json();
        setPendingWorkflows(data.workflows);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(
        `/api/admin/workflows/${workflowId}/approve`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setPendingWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
        toast.success("Workflow approved successfully");
      } else {
        toast.error("Failed to approve workflow");
      }
    } catch (error) {
      console.error("Error approving workflow:", error);
      toast.error("Failed to approve workflow");
    }
  };

  const handleRejectWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(
        `/api/admin/workflows/${workflowId}/reject`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setPendingWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
        toast.success("Workflow rejected successfully");
      } else {
        toast.error("Failed to reject workflow");
      }
    } catch (error) {
      console.error("Error rejecting workflow:", error);
      toast.error("Failed to reject workflow");
    }
  };

  const handleEditRoles = (user: User) => {
    setEditingUser(user.id);
    setEditingRoles([...user.roles]);
  };

  const handleSaveRoles = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles: editingRoles }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, roles: editingRoles } : user
          )
        );
        setEditingUser(null);
        toast.success("User roles updated successfully");
      } else {
        toast.error("Failed to update user roles");
      }
    } catch (error) {
      console.error("Error updating user roles:", error);
      toast.error("Failed to update user roles");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const toggleRole = (role: string) => {
    setEditingRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (!session?.user?.roles || !hasRole(session.user.roles, "ADMIN")) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to access the admin dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage workflows, users, and platform settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Workflows
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingWorkflows.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Developers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.roles.includes("DEVELOPER")).length}
            </div>
            <p className="text-xs text-muted-foreground">Active sellers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.roles.includes("BUYER")).length}
            </div>
            <p className="text-xs text-muted-foreground">Active buyers</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Workflows */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending Workflows</h2>
        {pendingWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ${workflow.price}
                    </span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      {workflow.user.name}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {workflow.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveWorkflow(workflow.id)}
                      className="flex-1"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectWorkflow(workflow.id)}
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Pending Workflows
                </h3>
                <p className="text-muted-foreground">
                  All workflows have been reviewed and processed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* User Management */}
      <div>
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardDescription className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Package className="h-4 w-4 inline mr-1" />
                    {user._count.workflows} workflows
                  </div>
                </div>

                {editingUser === user.id ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {["ADMIN", "DEVELOPER", "BUYER"].map((role) => (
                        <Badge
                          key={role}
                          variant={
                            editingRoles.includes(role) ? "default" : "outline"
                          }
                          className="cursor-pointer text-xs"
                          onClick={() => toggleRole(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveRoles(user.id)}
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRoles(user)}
                    className="w-full"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Roles
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
