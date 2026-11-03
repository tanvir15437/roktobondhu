import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { errorResponse } from '../utils/response';
import { StoreService } from '../services/store.service';
import { ENV } from '../config/env';

export interface AuthRequest extends Request {
  user?: any;
  tokenPayload?: TokenPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.[ENV.COOKIE_NAME];

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      errorResponse(res, 'Authentication required. Please sign in.', 401);
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      errorResponse(res, 'Invalid or expired session. Please sign in again.', 401);
      return;
    }

    const user = await StoreService.findUserById(payload.userId);
    if (!user) {
      errorResponse(res, 'Account not found.', 401);
      return;
    }

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (error: any) {
    errorResponse(res, 'Authentication failed', 401, error.message);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.[ENV.COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const user = await StoreService.findUserById(payload.userId);
        if (user) {
          req.user = user;
          req.tokenPayload = payload;
        }
      }
    }
  } catch {
    // ignore
  }
  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      errorResponse(res, 'Access denied. Insufficient permissions.', 403);
      return;
    }
    next();
  };
};
