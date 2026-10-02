export const AUTH_COOKIE = "dearp_auth";

// Cookie holds a hash of the password, so it can't be forged without knowing it
export async function authToken() {
    const data = new TextEncoder().encode(`dearp:${process.env.SITE_PASSWORD}`);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Buffer.from(hash).toString("hex");
}
