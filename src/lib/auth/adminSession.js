import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_USERNAME_COOKIE_NAME = "admin_username";
export const ADMIN_PASSWORD_COOKIE_NAME = "admin_password";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours = 28800 seconds

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

export function verifyAdminCredentials(username, password) {
  return (
    String(username || "").trim() === ADMIN_USERNAME &&
    String(password || "") === ADMIN_PASSWORD
  );
}

function createSessionFromCookies(username, password) {
  if (!username || !password) {
    return null;
  }

  return {
    username: String(username),
    password: String(password),
  };
}

export function getAdminSessionFromRequest(request) {
  const username = request?.cookies?.get(ADMIN_USERNAME_COOKIE_NAME)?.value;
  const password = request?.cookies?.get(ADMIN_PASSWORD_COOKIE_NAME)?.value;
  return createSessionFromCookies(username, password);
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  const username = cookieStore.get(ADMIN_USERNAME_COOKIE_NAME)?.value;
  const password = cookieStore.get(ADMIN_PASSWORD_COOKIE_NAME)?.value;
  return createSessionFromCookies(username, password);
}

export async function requireAdminSession(loginPath = "/admin/login") {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect(loginPath);
  }
  return session;
}
