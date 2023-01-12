import { z } from "zod";

export const VerifyEmailSchema = z.object({
  token: z.string(),
});

export type VerifyEmailDto = z.infer<typeof VerifyEmailSchema>;