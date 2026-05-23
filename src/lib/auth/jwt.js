import jwt from "jsonwebtoken";

export const CUSTOMER_JWT_EXPIRES_IN = "7d";
export const CUSTOMER_JWT_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET environment variable is required in production.",
    );
  }

  return secret || "development-customer-jwt-secret-change-me";
}

export function signCustomerToken(customerId, email) {
  return jwt.sign(
    {
      sub: String(customerId),
      email: String(email || ""),
      type: "customer",
    },
    getJwtSecret(),
    { expiresIn: CUSTOMER_JWT_EXPIRES_IN },
  );
}

export function verifyCustomerToken(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (payload?.type !== "customer" || !payload?.sub) {
      return null;
    }

    return {
      customerId: String(payload.sub),
      email: payload.email ? String(payload.email) : null,
    };
  } catch {
    return null;
  }
}
