import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCb);

const KEY_LENGTH = 64;

/**
 * Hashes password using scrypt and returns "salt:hash" format.
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(plainText, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/**
 * Verifies a plaintext password against "salt:hash" format.
 */
export async function verifyPassword(plainText: string, passwordHash: string): Promise<boolean> {
  const [salt, storedHex] = passwordHash.split(":");
  if (!salt || !storedHex) return false;

  const derived = (await scrypt(plainText, salt, KEY_LENGTH)) as Buffer;
  const stored = Buffer.from(storedHex, "hex");
  if (stored.length !== derived.length) return false;

  return timingSafeEqual(stored, derived);
}
