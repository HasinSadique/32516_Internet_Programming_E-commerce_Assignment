import bcrypt from "bcrypt";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password) {
  return bcrypt.hash(String(password), BCRYPT_ROUNDS);
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash) {
    return false;
  }

  try {
    return await bcrypt.compare(String(password), String(storedHash));
  } catch {
    return false;
  }
}
