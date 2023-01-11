import { randomBytes } from "crypto";

export const TOKEN_LENGTH = 32;

export function generateVerifyToken(hours: number) {
  const token = randomBytes(TOKEN_LENGTH).toString('base64')//.replace(/\//g, '');
  const hoursInMs = 1000 * 60 * 60 * hours;
  const expiresIn = new Date(Date.now() + hoursInMs);

  return { token, expiresIn };
}