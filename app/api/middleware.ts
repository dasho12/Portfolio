import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Admin-only paths that require authentication
  const adminPaths = [
    "/api/projects/(.*)",
    "/api/skills/(.*)",
    "/api/contact$",
    "/admin/(.*)",
  ];

  // Check if the current path requires admin authentication
  const requiresAdmin = adminPaths.some((path) =>
    new RegExp(`^${path}$`).test(request.nextUrl.pathname)
  );

  if (requiresAdmin) {
    // Allow GET requests to /api/projects and /api/skills
    if (
      request.method === "GET" &&
      (request.nextUrl.pathname === "/api/projects" ||
        request.nextUrl.pathname === "/api/skills")
    ) {
      return NextResponse.next();
    }

    // For other admin paths, verify authentication
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}
