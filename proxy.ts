import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, authToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
    if (request.cookies.get(AUTH_COOKIE)?.value === (await authToken())) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
}

// Everything is gated except the landing page, login API, Next internals and the song
export const config = {
    matcher: ["/((?!$|api/auth|_next/|favicon.ico|music/).*)"],
};
