import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;

  const parsed = JSON.parse(role || "{}");
  const path = req.nextUrl.pathname.replace(/^\//, "");
  const publicPaths = ["login", "register", "", "404"];
  const isPublicPath = publicPaths.includes(path);

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isPublicPath && path !== "") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isAccessable = parsed?.options?.includes(path);

  if (token && !isPublicPath && !isAccessable) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
