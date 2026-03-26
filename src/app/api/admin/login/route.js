import { NextResponse } from "next/server";
import {
  ADMIN_PASSWORD_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  ADMIN_USERNAME_COOKIE_NAME,
  verifyAdminCredentials,
} from "@/lib/auth/adminSession";

function buildUnauthorizedResponse() {
  return NextResponse.json(
    { error: "Invalid admin credentials." },
    { status: 401 },
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "");

    if (!username || !password) {
      return buildUnauthorizedResponse();
    }

    if (!verifyAdminCredentials(username, password)) {
      return buildUnauthorizedResponse();
    }

    const response = NextResponse.json({ success: true });
    // set the username cookie
    response.cookies.set({
      name: ADMIN_USERNAME_COOKIE_NAME,
      value: username,
      httpOnly: true,

      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });

    // set the password cookie
    response.cookies.set({
      name: ADMIN_PASSWORD_COOKIE_NAME,
      value: password,
      httpOnly: true,

      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json(
      { error: "Unable to complete login." },
      { status: 500 },
    );
  }
}
