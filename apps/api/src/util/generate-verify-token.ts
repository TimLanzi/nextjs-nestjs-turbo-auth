import { randomBytes } from "crypto";

export function generateVerifyToken(hours: number) {
  const token = randomBytes(24).toString('base64')//.replace(/\//g, '');
  const hoursInMs = 1000 * 60 * 60 * hours;
  const expiresIn = new Date(Date.now() + hoursInMs);

  return { token, expiresIn };
}