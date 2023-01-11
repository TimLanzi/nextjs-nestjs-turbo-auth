import { z } from "zod";
import { TOKEN_LENGTH } from 'src/util/generate-verify-token';
import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE } from "src/util/regex";

export const RecoverPasswordSchema = z.object({
  token: z.string().length(TOKEN_LENGTH, { message: "Token is either invalid or expired" }),
  email: z.string().trim().email(),
  password: z.string().trim().regex(PASSWORD_REGEX, { message: PASSWORD_REGEX_ERROR_MESSAGE }),
});

export type RecoverPasswordDto = z.infer<typeof RecoverPasswordSchema>;