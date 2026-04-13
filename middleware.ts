import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = [
  "/upload",
  "/compare",
  "/recommendations",
  "/interview",
] as const;

const publicPrefixes = ["/login", "/register"] as const;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/upload", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isPublicAuth = publicPrefixes.some((p) => pathname.startsWith(p));
  if (isPublicAuth && token) {
    return NextResponse.redirect(new URL("/upload", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/upload/:path*",
    "/compare/:path*",
    "/recommendations/:path*",
    "/interview/:path*",
    "/login",
    "/register",
  ],
};
