import { z } from "zod";

export const BeginPasswordRecoverySchema = z.object({
  email: z.string().trim().email(),
});

export type BeginPasswordRecoveryDto = z.infer<typeof BeginPasswordRecoverySchema>;