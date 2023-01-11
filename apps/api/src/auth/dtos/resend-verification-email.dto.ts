import { z } from "zod";

export const ResendVerificationSchema = z.object({
  email: z.string().trim().email(),
});

export type ResendVerificationEmailDto = z.infer<typeof ResendVerificationSchema>;