import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface SessionPayload {
  authenticated: boolean;
  iat: number;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("WARNING: ADMIN_SESSION_SECRET is not set in production. Using fallback secret.");
    }
    return "dev-stable-session-secret-change-in-production-portfolio-2026";
  }
  return secret;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

/**
 * Creates an opaque cryptographically-signed session token.
 * Contains ONLY minimal metadata (authenticated, iat, exp).
 * NEVER contains ADMIN_SECRET_KEY.
 */
export function createSessionToken(): string {
  const now = Date.now();
  const payload: SessionPayload = {
    authenticated: true,
    iat: now,
    exp: now + SESSION_DURATION_MS,
  };

  const payloadStr = base64UrlEncode(JSON.stringify(payload));
  const secret = getSessionSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("base64url");

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies the HMAC-SHA256 signature and checks expiry of the session token.
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadStr, signature] = parts;
  const secret = getSessionSecret();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("base64url");

  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return false;
    }

    const payload: SessionPayload = JSON.parse(base64UrlDecode(payloadStr));
    if (!payload.authenticated) return false;
    if (Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Helper to check current session validity in server components / routes.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * Sets the HttpOnly session cookie on the server.
 */
export async function setAdminSessionCookie(): Promise<void> {
  const token = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Clears the session cookie on logout.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}
