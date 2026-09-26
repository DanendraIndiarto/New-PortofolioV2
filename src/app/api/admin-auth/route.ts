import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Rate limiting in-memory store (IP -> { count, expiresAt })
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown-ip";
}

function getAdminPin(): string {
  // Prefer private server-side variable, fallback to NEXT_PUBLIC_ for compatibility
  return (
    process.env.ADMIN_PIN ||
    process.env.NEXT_PUBLIC_ADMIN_PIN ||
    "newportoV2"
  );
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "danendra_portfolio_secure_session_secret_2026_salt"
  );
}

function generateSessionToken(): string {
  const secret = getSessionSecret();
  // Valid for the current day
  const dateKey = new Date().toISOString().slice(0, 10);
  return crypto.createHmac("sha256", secret).update(`admin-session-${dateKey}`).digest("hex");
}

function isValidSessionToken(token: string): boolean {
  if (!token) return false;
  const expected = generateSessionToken();
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

// GET: Check authentication status
export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("portfolio_admin_token")?.value;
  const isValid = sessionCookie ? isValidSessionToken(sessionCookie) : false;

  return NextResponse.json({ authenticated: isValid });
}

// POST: Verify PIN and issue auth session
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  // Rate Limiting: Max 5 failed attempts per 10 minutes
  const attemptData = loginAttempts.get(ip);
  if (attemptData) {
    if (now < attemptData.resetAt && attemptData.count >= 5) {
      const waitMinutes = Math.ceil((attemptData.resetAt - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${waitMinutes} menit.`,
        },
        { status: 429 }
      );
    }
    if (now >= attemptData.resetAt) {
      loginAttempts.delete(ip);
    }
  }

  let body: { pin?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Format request tidak valid." },
      { status: 400 }
    );
  }

  const { pin } = body;
  if (!pin || typeof pin !== "string") {
    return NextResponse.json(
      { success: false, error: "PIN wajib diisi." },
      { status: 400 }
    );
  }

  const correctPin = getAdminPin();
  const isMatch = pin.trim() === correctPin.trim();

  if (!isMatch) {
    // Record failed attempt
    const current = loginAttempts.get(ip) || { count: 0, resetAt: now + 10 * 60 * 1000 };
    current.count += 1;
    loginAttempts.set(ip, current);

    const remaining = Math.max(0, 5 - current.count);
    return NextResponse.json(
      {
        success: false,
        error: `PIN tidak valid. Sisa percobaan: ${remaining}`,
      },
      { status: 401 }
    );
  }

  // Login successful: reset rate limiter for this IP
  loginAttempts.delete(ip);

  const token = generateSessionToken();
  const res = NextResponse.json({ success: true, message: "Autentikasi berhasil" });

  res.cookies.set("portfolio_admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return res;
}

// DELETE: Logout
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logout berhasil" });
  res.cookies.delete("portfolio_admin_token");
  return res;
}
