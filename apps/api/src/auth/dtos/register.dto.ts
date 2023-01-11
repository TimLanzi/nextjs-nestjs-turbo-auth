import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;