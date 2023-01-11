import { z } from "zod";
import { TOKEN_LENGTH } from 'src/util/generate-verify-token';

export const VerifyEmailSchema = z.object({
  token: z.string().length(TOKEN_LENGTH, { message: "Token is either invalid or expired" }),
});

export type VerifyEmailDto = z.infer<typeof VerifyEmailSchema>;