import { z } from "zod";

export const BeginPasswordResetSchema = z.object({
  email: z.string().trim().email(),
});

export type BeginPasswordResetDto = z.infer<typeof BeginPasswordResetSchema>;
