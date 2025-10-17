import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const roleData = req.cookies.get("role")?.value;

  let parsed;
  try {
    parsed = roleData ? JSON.parse(roleData) : {};
  } catch (error) {
    console.error("Error parsing role cookie:", error);
    parsed = {};
  }
  const pathname = req.nextUrl.pathname;
  const path = pathname === "/" ? "/" : pathname.replace(/^\//, "");
  const publicPaths = ["login", "register", "404", "401"];
  const isPublicPath = publicPaths.includes(path);

  if (!token && !isPublicPath && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && (path === "login" || path === "register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (token && !isPublicPath && pathname !== "/") {
    const isAccessible = parsed?.options?.includes(path);

    if (!isAccessible) {
      console.log(`Access denied to ${path}. Redirecting to /401`);
      return NextResponse.redirect(new URL("/401", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
