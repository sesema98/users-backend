import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { HttpError } from "../utils/http-error";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Solicitud invalida",
      details: error.flatten()
    });
    return;
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? null
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    response.status(500).json({
      message: "No fue posible conectarse a la base de datos"
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    message: "Ocurrio un error inesperado"
  });
}
