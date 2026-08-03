import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_request: Request, response: Response): void {
  response.status(404).json({ message: "Route not found" });
}

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  response.status(500).json({ message: error.message || "Internal server error" });
}
