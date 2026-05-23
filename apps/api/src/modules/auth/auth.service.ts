import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { addDays } from "date-fns";
import { nanoid } from "nanoid";
import type { z } from "zod";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/http-error.js";
import type { loginSchema, refreshSchema, signupSchema } from "./auth.schemas.js";

type SignupInput = z.infer<typeof signupSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type RefreshInput = z.infer<typeof refreshSchema>;

function accessToken(user: { id: string; email: string; fullName: string }) {
  return jwt.sign({ sub: user.id, email: user.email, fullName: user.fullName }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL
  });
}

async function session(user: { id: string; email: string; fullName: string }) {
  const refreshToken = nanoid(64);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: await argon2.hash(refreshToken),
      expiresAt: addDays(new Date(), 30)
    }
  });
  return { user, accessToken: accessToken(user), refreshToken };
}

export const authService = {
  async signup(input: SignupInput) {
    const exists = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (exists) throw new HttpError(409, "Email already registered");
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        fullName: input.fullName,
        passwordHash: await argon2.hash(input.password)
      },
      select: { id: true, email: true, fullName: true }
    });
    return session(user);
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, input.password))) {
      throw new HttpError(401, "Invalid credentials");
    }
    return session({ id: user.id, email: user.email, fullName: user.fullName });
  },

  async refresh(input: RefreshInput) {
    const candidates = await prisma.refreshToken.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true }
    });
    for (const candidate of candidates) {
      if (await argon2.verify(candidate.tokenHash, input.refreshToken)) {
        await prisma.refreshToken.update({ where: { id: candidate.id }, data: { revokedAt: new Date() } });
        return session({ id: candidate.user.id, email: candidate.user.email, fullName: candidate.user.fullName });
      }
    }
    throw new HttpError(401, "Invalid refresh token");
  }
};
