import { Request } from "express";

export function getBaseUrl(req: Request) {
  // Add port 3000
  let hostname = req.hostname;
  const isLocalhost = hostname === "localhost";

  if (isLocalhost) {
    const hasPort = !!hostname.split(":")[1];
    if (!hasPort) {
      hostname += ":3000";
    }
  }

  return `${req.protocol}://${hostname}`;
}
