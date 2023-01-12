import { z } from "zod";
import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE } from "src/util/regex";

export const ResetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().trim().email(),
  password: z.string().trim().regex(PASSWORD_REGEX, { message: PASSWORD_REGEX_ERROR_MESSAGE }),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;