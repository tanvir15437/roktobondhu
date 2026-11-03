import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export const successResponse = <T>(
  res: Response,
  data?: T,
  message = 'Request successful',
  statusCode = 200
): Response => {
  const body: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(statusCode).json(body);
};

export const errorResponse = (
  res: Response,
  message = 'An error occurred',
  statusCode = 400,
  errors: any = null
): Response => {
  const body: ApiResponse = {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  };
  return res.status(statusCode).json(body);
};
