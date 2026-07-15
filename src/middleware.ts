import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Public paths that don't need auth
const PUBLIC_PATHS = ["/cms/login", "/api/auth/login", "/api/auth/logout"];

// Public API paths (for contact form etc)
const PUBLIC_API_PATHS = ["/api/contact"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow public API paths
  if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow GET requests to gallery API (for public display on About page)
  if (pathname.startsWith("/api/gallery") && request.method === "GET") {
    return NextResponse.next();
  }

  // Protect CMS pages
  if (pathname.startsWith("/cms")) {
    const token = request.cookies.get("cms-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/cms/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      // Token invalid or expired — clear and redirect
      const response = NextResponse.redirect(new URL("/cms/login", request.url));
      response.cookies.set("cms-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      return response;
    }
  }

  // Protect CMS API routes (gallery POST/PUT/DELETE, upload)
  if (pathname.startsWith("/api/gallery") || pathname.startsWith("/api/upload")) {
    const token = request.cookies.get("cms-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      // Token invalid or expired
      const response = NextResponse.json({ error: "Token expired" }, { status: 401 });
      response.cookies.set("cms-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/:path*", "/api/gallery/:path*", "/api/upload/:path*"],
};
