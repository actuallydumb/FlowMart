import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

    // If user is not authenticated and trying to access protected pages
    if (!isAuth && (isAdminPage || isDashboardPage)) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // If user is trying to access admin page but is not admin
    if (isAdminPage && isAuth && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
