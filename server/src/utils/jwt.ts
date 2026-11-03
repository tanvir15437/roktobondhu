import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { ENV } from '../config/env';

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const setAuthCookie = (res: Response, token: string): void => {
  const isProduction = ENV.NODE_ENV === 'production';
  res.cookie(ENV.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(ENV.COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
};
