import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ErrorSchema } from "../schemas/error";
import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE } from "../utils/regex";

const c = initContract();

export const contract = c.router({
  login: {
    contentType: "application/json",
    method: "POST",
    path: '/auth/login',
    responses: {
      200: z.object({
        accessToken: z.string(),
        accessTokenExpires: z.number(),
        refreshToken: z.string(),
        refreshTokenExpires: z.number(),
      }),
      400: ErrorSchema,
      401: ErrorSchema,
    },
    body: z.object({
      email: z.string().trim().email(),
      password: z.string().trim(),
    }),
    summary: 'Log in the user',
  },

  register: {
    contentType: "application/json",
    method: 'POST',
    path: '/auth/register',
    responses: {
      201: z.object({
        id: z.string(),
        email: z.string().email(),
      }),
      400: ErrorSchema,
    },
    body: z.object({
      email: z.string().trim().email(),
      password: z.string().trim().regex(PASSWORD_REGEX, { message: PASSWORD_REGEX_ERROR_MESSAGE }),
    }),
    summary: 'Register a new user',
  },

  logout: {
    contentType: "application/json",
    method: 'POST',
    path: '/auth/logout',
    responses: {
      200: z.object({
        message: z.string(),
      }),
      400: ErrorSchema,
    },
    body: z.object({}),
  },

  session: {
    method: 'GET',
    path: '/auth/me',
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string().nullable(),
        role: z.string(),
      }),
      401: ErrorSchema,
    },
  },

  refresh: {
    method: 'GET',
    path: '/auth/refresh',
    responses: {
      200: z.object({
        accessToken: z.string(),
        accessTokenExpires: z.number(),
        refreshToken: z.string(),
        refreshTokenExpires: z.number(),
      }),
      403: ErrorSchema,
    },
  },

  verifyEmail: {
    contentType: "application/json",
    method: 'POST',
    path: '/auth/verify-email',
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string().email(),
      }),
      400: ErrorSchema,
    },
    body: z.object({
      token: z.string(),
    }),
  },

  resendVerificationEmail: {
    contentType: "application/json",
    method: 'POST',
    path: '/auth/resend-verification-email',
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string().email(),
      }),
      400: ErrorSchema,
    },
    body: z.object({
      email: z.string().email(),
    }),
  },

  startPasswordReset: {
    contentType: "application/json",
    method: 'PUT',
    path: '/auth/password-reset',
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string().email(),
      }),
      400: ErrorSchema,
    },
    body: z.object({
      email: z.string().email(),
    }),
  },

  checkPasswordResetToken: {
    method: 'GET',
    path: '/auth/password-reset/:token',
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string().email(),
      }),
      400: ErrorSchema,
    },
    pathParams: z.object({
      token: z.string(),
    }),
  },

  resetPassword: {
    contentType: "application/json",
    method: 'POST',
    path: '/auth/password-reset',
    responses: {
      200: z.object({
        id: z.string(),
        email: z.string().email(),
      }),
      400: ErrorSchema,
    },
    body: z.object({
      token: z.string(),
      email: z.string().trim().email(),
      password: z.string().trim().regex(PASSWORD_REGEX, { message: PASSWORD_REGEX_ERROR_MESSAGE }),
    }),
  },
});