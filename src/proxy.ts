import { NextRequest, NextResponse } from "next/server";

const SIGN_IN_URL = "/auth/sign-in";
const DASHBOARD_URL = "/";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        // JWT payload uses base64url encoding.
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        const decoded = atob(padded);
        return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload) return true;

    const exp = payload.exp;
    if (typeof exp !== "number") return false;

    try {
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { pathname } = request.nextUrl;
    const isAuthPage = pathname.startsWith("/auth");

    // Expired access token: force logout and send user to sign-in.
    if (accessToken && isTokenExpired(accessToken)) {
        const response = NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("resetPasswordToken");
        response.cookies.delete("authEmail");
        return response;
    }

    // Authenticated users should not stay on auth pages.
    if (accessToken && isAuthPage) {
        return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
    }

    const isProtectedPage = !isAuthPage;

    // Unauthenticated users cannot access protected app pages.
    if (!accessToken && isProtectedPage) {
        return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/auth/:path*",
        "/",
        "/orders/:path*",
        "/menu-&-catalog/:path*",
        "/banner-ads/:path*",
        "/riders/:path*",
        "/settings/:path*"
    ]
};