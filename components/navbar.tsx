"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShoppingCart,
  Upload,
  BarChart3,
  Shield,
  Users,
  FileText,
  Home,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { hasRole } from "@/types";
import { useTheme } from "next-themes";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  const isBuyer = session?.user?.roles && hasRole(session.user.roles, "BUYER");
  const isDeveloper =
    session?.user?.roles && hasRole(session.user.roles, "DEVELOPER");
  const isAdmin = session?.user?.roles && hasRole(session.user.roles, "ADMIN");
  const isVerified = session?.user?.sellerVerificationStatus === "APPROVED";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/marketplace?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">WorkflowHub</span>
            </Link>
            <div className="h-9 w-9" /> {/* Placeholder for theme toggle */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">WorkflowKart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>

            {/* Main Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <Link
                href="/marketplace"
                className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Workflows</span>
              </Link>

              <Link
                href="/about"
                className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>About</span>
              </Link>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0 relative"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Menu */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {session.user.roles?.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="text-xs"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                      {/* Verification Status for Developers */}
                      {isDeveloper && (
                        <div className="flex items-center gap-1 mt-1">
                          {isVerified ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-yellow-600" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {isVerified ? "Verified" : "Pending Verification"}
                          </span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Role-based menu items */}
                  {isBuyer && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          My Purchases
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {isDeveloper && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard?tab=developer"
                          className="flex items-center"
                        >
                          <Package className="mr-2 h-4 w-4" />
                          My Workflows
                        </Link>
                      </DropdownMenuItem>
                      {isVerified && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/seller/create-workflow"
                            className="flex items-center"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Create Workflow
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/sellers"
                          className="flex items-center"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Seller Management
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9 p-0"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-4 pb-4 pt-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/marketplace"
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Workflows</span>
                </Link>

                <Link
                  href="/about"
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className="h-4 w-4" />
                  <span>About</span>
                </Link>
              </div>

              {/* Mobile User Menu */}
              {session?.user ? (
                <div className="space-y-2 border-t pt-4">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {session.user.roles?.map((role) => (
                        <Badge
                          key={role}
                          variant="secondary"
                          className="text-xs"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                    {/* Verification Status for Developers */}
                    {isDeveloper && (
                      <div className="flex items-center gap-1 mt-1">
                        {isVerified ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {isVerified ? "Verified" : "Pending Verification"}
                        </span>
                      </div>
                    )}
                  </div>

                  {isBuyer && (
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>My Purchases</span>
                    </Link>
                  )}

                  {isDeveloper && (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard?tab=developer"
                        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        <span>My Workflows</span>
                      </Link>
                      {isVerified && (
                        <Link
                          href="/seller/create-workflow"
                          className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Upload className="h-4 w-4" />
                          <span>Create Workflow</span>
                        </Link>
                      )}
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <Link
                        href="/admin/sellers"
                        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Users className="h-4 w-4" />
                        <span>Seller Management</span>
                      </Link>
                    </>
                  )}

                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 border-t pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
