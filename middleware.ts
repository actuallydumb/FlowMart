import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/error",
    "/api/auth",
    "/api/webhooks",
    "/api/uploadthing",
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to signin
  if (!token) {
    const signinUrl = new URL("/auth/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Check onboarding completion for protected routes
  const protectedRoutes = [
    "/dashboard",
    "/marketplace",
    "/profile",
    "/workflow",
    "/admin",
    "/seller",
  ];

  const requiresOnboarding = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (requiresOnboarding) {
    try {
      // Check onboarding status
      const onboardingResponse = await fetch(
        `${request.nextUrl.origin}/api/onboarding/status`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (onboardingResponse.ok) {
        const onboardingData = await onboardingResponse.json();

        // If onboarding is not completed, redirect to onboarding
        if (!onboardingData.onboardingCompleted) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }

        // For seller-specific routes, check seller verification
        if (
          pathname.startsWith("/seller") ||
          pathname.includes("create-workflow")
        ) {
          if (!onboardingData.isSellerVerified) {
            // Redirect to dashboard with error message
            const dashboardUrl = new URL("/dashboard", request.url);
            dashboardUrl.searchParams.set("error", "seller_not_verified");
            return NextResponse.redirect(dashboardUrl);
          }
        }

        // For admin routes, check admin role
        if (pathname.startsWith("/admin")) {
          const hasAdminRole = onboardingData.roles?.includes("ADMIN");
          if (!hasAdminRole) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // If there's an error, allow the request to proceed
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
