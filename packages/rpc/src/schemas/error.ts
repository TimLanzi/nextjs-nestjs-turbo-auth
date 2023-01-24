import { z } from "zod";

export const ErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string(),
});