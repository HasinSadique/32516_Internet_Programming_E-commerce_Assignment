const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{7,16}$/;

export function validateRegistrationPayload(body) {
  const errors = {};

  const fullName = String(body?.fullName ?? "").trim();
  const dateOfBirth = String(body?.dateOfBirth ?? "").trim();
  const address = String(body?.address ?? "").trim();
  const postalCode = String(body?.postalCode ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const phone = String(body?.phone ?? "").trim();
  const password = String(body?.password ?? "");
  const confirmPassword = String(body?.confirmPassword ?? "");

  if (!fullName) {
    errors.fullName = "Full name is required.";
  }

  if (!dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else if (Number.isNaN(Date.parse(dateOfBirth))) {
    errors.dateOfBirth = "Enter a valid date of birth.";
  }

  if (!address) {
    errors.address = "Address is required.";
  }

  if (!postalCode) {
    errors.postalCode = "Postal code is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please re-type your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return {
    errors,
    values: {
      fullName,
      dateOfBirth,
      address,
      postalCode,
      email,
      phone,
      password,
      confirmPassword,
    },
  };
}

export function validateLoginPayload(body) {
  const errors = {};
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return { errors, values: { email, password } };
}
