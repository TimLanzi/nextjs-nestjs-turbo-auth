import { z } from "zod";

export const CheckPasswordResetTokenSchema = z.object({
  token: z.string(),
})

export type CheckPasswordResetTokenDto = z.infer<typeof CheckPasswordResetTokenSchema>;