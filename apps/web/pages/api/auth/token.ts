import { getSession } from "@acme/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * Provides tokens to client-side in order to request stuff from server app
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Get session to potentially trigger refresh flow
  await getSession({ req, res })
  const token = await getToken({ req });

  res.status(200).json({ token });
};