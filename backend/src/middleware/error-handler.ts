import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public readonly statusCode: number, message: string, public readonly details?: unknown) {
    super(message);
    this.name = "HttpError";
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: "Invalid request", details: error.flatten() });
    return;
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;
  if (statusCode === 500) console.error(error);
  res.status(statusCode).json({ error: message, ...(error instanceof HttpError && error.details ? { details: error.details } : {}) });
};
