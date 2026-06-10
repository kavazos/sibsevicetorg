import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log("[MIDDLEWARE] Checking pathname:", pathname);
  console.log("[MIDDLEWARE] Cookies:", request.cookies.getAll());

  // Защищаем все маршруты /admin/* и /api/admin/* кроме /admin/login
  if ((pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) &&
      !pathname.startsWith("/admin/login") &&
      !pathname.startsWith("/api/admin/login") &&
      !pathname.startsWith("/api/admin/logout")) {
    
    console.log("[MIDDLEWARE] Checking admin route:", pathname);
    
    // Проверяем наличие session cookie
    const sessionToken = request.cookies.get("admin-session");
    console.log("[MIDDLEWARE] Session token:", sessionToken?.value || "NOT FOUND");

    if (!sessionToken) {
      console.log("[MIDDLEWARE] No session token, redirecting to login");
      // Если это запрос к странице (не API), перенаправляем на /admin/login
      if (pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      // Если это API запрос, возвращаем 401
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
