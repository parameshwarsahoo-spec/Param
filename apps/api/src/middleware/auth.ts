import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/http-error.js";

type AccessPayload = { sub: string; email: string; fullName: string };

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing bearer token"));
  }

  try {
    const payload = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AccessPayload;
    const user = await prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null },
      select: { id: true, email: true, fullName: true }
    });

    if (!user) throw new HttpError(401, "Invalid session");
    req.user = user;
    return next();
  } catch (error) {
    return next(error instanceof HttpError ? error : new HttpError(401, "Invalid or expired token"));
  }
}
