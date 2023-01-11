import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE } from "src/util/regex";
import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().regex(PASSWORD_REGEX, { message: PASSWORD_REGEX_ERROR_MESSAGE }),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;