import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  fullName: z.string().min(2).max(160)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20)
});
