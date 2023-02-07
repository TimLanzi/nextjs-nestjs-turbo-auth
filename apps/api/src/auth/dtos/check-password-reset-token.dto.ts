import { z } from "zod";

export const CheckPasswordResetTokenSchema = z.object({
  token: z.string(),
  email: z.string().email(),
});

export type CheckPasswordResetTokenDto = z.infer<
  typeof CheckPasswordResetTokenSchema
>;
