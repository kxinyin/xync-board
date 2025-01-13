import { NextResponse } from "next/server";
import { auth } from "./auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth((req) => {
  const reqUrl = new URL(req.url);

  // Redirect to login page if not authenticated
  if (!req.auth && reqUrl.pathname !== "/login") {
    const pathname = reqUrl?.pathname;

    const loginUrl =
      pathname === "/"
        ? "/login"
        : `/login?callbackUrl=${encodeURIComponent(pathname)}`;

    return NextResponse.redirect(new URL(loginUrl, req.url));
  }
});
