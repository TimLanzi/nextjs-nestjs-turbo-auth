import { z } from "zod";
import { TOKEN_LENGTH } from 'src/util/generate-verify-token';

export const RecoverPasswordSchema = z.object({
  token: z.string().length(TOKEN_LENGTH, { message: "Token is either invalid or expired" }),
  email: z.string().trim().email(),
  password: z.string().trim(),
});

export type RecoverPasswordDto = z.infer<typeof RecoverPasswordSchema>;