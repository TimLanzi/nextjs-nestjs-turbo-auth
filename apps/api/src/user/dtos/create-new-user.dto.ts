import { z } from "zod";

const CreateNewUserSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().trim(),
  verify_email_token: z.string(),
  verify_email_expires: z.date(),
});

export type CreateNewUserDto = z.infer<typeof CreateNewUserSchema>;