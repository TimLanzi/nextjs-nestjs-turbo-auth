import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { ZodError } from "zod";

@Catch(HttpException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    
    if (exception.cause instanceof ZodError) {
      return res.status(400).json({ message: exception.cause.flatten().fieldErrors })
    }

    return res.status(exception.getStatus()).json({ message: exception.message, error: exception.name });
  }
}