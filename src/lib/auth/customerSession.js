import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findCustomerById, toPublicCustomer } from "@/lib/data/users";
import {
  CUSTOMER_JWT_MAX_AGE_SECONDS,
  signCustomerToken,
  verifyCustomerToken,
} from "@/lib/auth/jwt";

export const CUSTOMER_TOKEN_COOKIE_NAME = "customer_token";
export const CUSTOMER_SESSION_MAX_AGE_SECONDS = CUSTOMER_JWT_MAX_AGE_SECONDS;

export function getCustomerTokenFromRequest(request) {
  return request?.cookies?.get(CUSTOMER_TOKEN_COOKIE_NAME)?.value || null;
}

export async function getCustomerTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE_NAME)?.value || null;
}

async function buildSessionFromToken(token) {
  const decoded = verifyCustomerToken(token);
  if (!decoded?.customerId) {
    return null;
  }

  const customer = await findCustomerById(decoded.customerId);
  if (!customer) {
    return null;
  }

  return {
    customerId: customer._id.toString(),
    customer: toPublicCustomer(customer),
  };
}

export async function getCustomerSessionFromRequest(request) {
  const token = getCustomerTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return buildSessionFromToken(token);
}

export async function getCustomerSessionFromCookies() {
  const token = await getCustomerTokenFromCookies();
  if (!token) {
    return null;
  }

  return buildSessionFromToken(token);
}

export function attachCustomerAuthCookie(response, customer) {
  const token = signCustomerToken(customer._id.toString(), customer.email);

  response.cookies.set({
    name: CUSTOMER_TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_SESSION_MAX_AGE_SECONDS,
  });

  return response;
}

export function clearCustomerAuthCookie(response) {
  response.cookies.set({
    name: CUSTOMER_TOKEN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function requireCustomerSession(
  loginPath = "/login",
  redirectTo = null,
) {
  const session = await getCustomerSessionFromCookies();
  if (!session) {
    const destination = redirectTo
      ? `${loginPath}?redirect=${encodeURIComponent(redirectTo)}`
      : loginPath;
    redirect(destination);
  }

  return session;
}
