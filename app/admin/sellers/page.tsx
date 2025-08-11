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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  X,
  Users,
  Package,
  Shield,
  Search,
  Filter,
  Calendar,
  Mail,
  Building,
  User,
  Eye,
  MessageSquare,
} from "lucide-react";
import { hasRole } from "@/types";
import { toast } from "sonner";

interface Seller {
  id: string;
  name: string | null;
  email: string | null;
  roles: string[];
  createdAt: string;
  organization: {
    id: string;
    name: string;
  } | null;
  sellerVerifications: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt: string;
    reviewedAt: string | null;
    notes: string | null;
  }[];
  _count: {
    workflows: number;
  };
}

export default function SellerManagementPage() {
  const { data: session } = useSession();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/admin/sellers?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSellers(data.sellers);
      } else {
        toast.error("Failed to fetch sellers");
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
      toast.error("Failed to fetch sellers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSeller = async (sellerId: string) => {
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        setSellers((prev) =>
          prev.map((seller) =>
            seller.id === sellerId
              ? {
                  ...seller,
                  sellerVerifications: seller.sellerVerifications.map((sv) =>
                    sv.id === seller.sellerVerifications[0]?.id
                      ? {
                          ...sv,
                          status: "APPROVED",
                          reviewedAt: new Date().toISOString(),
                          notes,
                        }
                      : sv
                  ),
                }
              : seller
          )
        );
        setSelectedSeller(null);
        setNotes("");
        toast.success("Seller approved successfully");
      } else {
        toast.error("Failed to approve seller");
      }
    } catch (error) {
      console.error("Error approving seller:", error);
      toast.error("Failed to approve seller");
    }
  };

  const handleRejectSeller = async (sellerId: string) => {
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        setSellers((prev) =>
          prev.map((seller) =>
            seller.id === sellerId
              ? {
                  ...seller,
                  sellerVerifications: seller.sellerVerifications.map((sv) =>
                    sv.id === seller.sellerVerifications[0]?.id
                      ? {
                          ...sv,
                          status: "REJECTED",
                          reviewedAt: new Date().toISOString(),
                          notes,
                        }
                      : sv
                  ),
                }
              : seller
          )
        );
        setSelectedSeller(null);
        setNotes("");
        toast.success("Seller rejected successfully");
      } else {
        toast.error("Failed to reject seller");
      }
    } catch (error) {
      console.error("Error rejecting seller:", error);
      toast.error("Failed to reject seller");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Not Applied</Badge>;
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      !searchTerm ||
      seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      seller.sellerVerifications[0]?.status === statusFilter.toUpperCase() ||
      (!seller.sellerVerifications[0] && statusFilter === "NOT_APPLIED");

    return matchesSearch && matchesStatus;
  });

  if (!session?.user?.roles || !hasRole(session.user.roles, "ADMIN")) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to access seller management.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
        <h1 className="text-3xl font-bold mb-2">Seller Management</h1>
        <p className="text-muted-foreground">
          Review and approve sellers who want to upload workflows
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered developers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                sellers.filter(
                  (s) => s.sellerVerifications[0]?.status === "PENDING"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Sellers
            </CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                sellers.filter(
                  (s) => s.sellerVerifications[0]?.status === "APPROVED"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Active sellers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Sellers
            </CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                sellers.filter(
                  (s) => s.sellerVerifications[0]?.status === "REJECTED"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Rejected applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="NOT_APPLIED">Not Applied</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchSellers} variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Sellers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSellers.map((seller) => (
          <Card
            key={seller.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{seller.name}</CardTitle>
                {getStatusBadge(
                  seller.sellerVerifications[0]?.status || "NOT_APPLIED"
                )}
              </div>
              <CardDescription className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {seller.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Organization:</span>
                  <span>{seller.organization?.name || "None"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Workflows:</span>
                  <span>{seller._count.workflows}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joined:</span>
                  <span>{new Date(seller.createdAt).toLocaleDateString()}</span>
                </div>
                {seller.sellerVerifications[0] && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Applied:</span>
                    <span>
                      {new Date(
                        seller.sellerVerifications[0].submittedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {seller.sellerVerifications[0]?.status === "PENDING" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setSelectedSeller(seller)}
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </div>
              )}

              {seller.sellerVerifications[0]?.status === "APPROVED" && (
                <div className="text-sm text-green-600 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Approved on{" "}
                  {new Date(
                    seller.sellerVerifications[0].reviewedAt!
                  ).toLocaleDateString()}
                </div>
              )}

              {seller.sellerVerifications[0]?.status === "REJECTED" && (
                <div className="text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  Rejected on{" "}
                  {new Date(
                    seller.sellerVerifications[0].reviewedAt!
                  ).toLocaleDateString()}
                </div>
              )}

              {!seller.sellerVerifications[0] && (
                <div className="text-sm text-muted-foreground">
                  Has not applied for seller verification
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSellers.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sellers Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter
                  ? "Try adjusting your search or filter criteria."
                  : "No sellers have registered yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Review Seller Application</CardTitle>
              <CardDescription>
                Review {selectedSeller.name}'s application for seller
                verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Notes (optional)</label>
                <Input
                  placeholder="Add notes about your decision..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleApproveSeller(selectedSeller.id)}
                  className="flex-1"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRejectSeller(selectedSeller.id)}
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedSeller(null);
                  setNotes("");
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
