import { cookies } from "next/headers";
import { AUTH_COOKIE, authToken } from "../../../lib/auth";

export async function GET() {
    const cookie = (await cookies()).get(AUTH_COOKIE)?.value;
    return new Response(null, { status: cookie === (await authToken()) ? 200 : 401 });
}

export async function POST(request: Request) {
    const { password } = await request.json();
    if (!process.env.SITE_PASSWORD || password !== process.env.SITE_PASSWORD) {
        return new Response(null, { status: 401 });
    }

    (await cookies()).set(AUTH_COOKIE, await authToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
    });
    return new Response(null, { status: 204 });
}
