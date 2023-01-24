import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ErrorSchema } from "../schemas/error";

const c = initContract();

export const contract = c.router({
  adminTest: {
    method: "GET",
    path: '/user/admin',
    responses: {
      200: z.object({
        message: z.string(),
      }),
      401: ErrorSchema,
      403: ErrorSchema,
    },
  },
  
  moderatorTest: {
    method: "GET",
    path: '/user/admin',
    responses: {
      200: z.object({
        message: z.string(),
      }),
      401: ErrorSchema,
      403: ErrorSchema,
    },
  },
})