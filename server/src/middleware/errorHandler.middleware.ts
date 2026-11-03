import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Error]', err);

  // Mongoose duplicate key error (e.g. unique email or phone)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    errorResponse(res, `An account with this ${field} already exists.`, 409);
    return;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    errorResponse(res, `Resource not found with id: ${err.value}`, 404);
    return;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((val: any) => val.message);
    errorResponse(res, 'Validation error', 400, messages);
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  errorResponse(res, message, statusCode);
};
