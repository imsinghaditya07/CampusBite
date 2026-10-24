import { Response } from 'express';

export function sendSuccess<T = any>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: Record<string, any>
) {
  return res.status(statusCode).json({
    success: true,
    ...data,
    ...(meta ? { meta } : {}),
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string,
  details?: any
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: code || 'BAD_REQUEST',
      message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    },
  });
}
