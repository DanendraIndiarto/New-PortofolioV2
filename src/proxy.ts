import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secretPath = (process.env.ADMIN_SECRET_PATH || "/newportoadmin").trim();

  // 1. Strict blocking of old /admin and bot scan targets
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/wp-admin" ||
    pathname.startsWith("/wp-admin/") ||
    pathname === "/wp-login.php"
  ) {
    // Completely disguise the route with a 404 Not Found response
    return NextResponse.rewrite(new URL("/not-found", request.url), {
      status: 404,
    });
  }

  // 2. If a custom secret path is configured (e.g. /my-secret-portal) and differs from /newportoadmin
  if (secretPath !== "/newportoadmin") {
    // If request matches the custom secret path, rewrite to internal /newportoadmin
    if (pathname === secretPath || pathname.startsWith(`${secretPath}/`)) {
      const internalPath = pathname.replace(secretPath, "/newportoadmin");
      return NextResponse.rewrite(new URL(internalPath, request.url));
    }

    // If someone attempts to access /newportoadmin directly while custom secret is configured, mask it as 404
    if (pathname === "/newportoadmin" || pathname.startsWith("/newportoadmin/")) {
      return NextResponse.rewrite(new URL("/not-found", request.url), {
        status: 404,
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/newportoadmin/:path*",
    "/newportoadmin",
    "/wp-admin/:path*",
    "/wp-admin",
    "/wp-login.php",
    // Also match any custom secret path dynamically if specified, handled via proxy
  ],
};
