import { UsePipes, applyDecorators } from "@nestjs/common";
import { Schema } from "zod";

import { ZodValidationPipe } from "./validate-zod.pipe";

export const ZodValidation = (schema: Schema) =>
  applyDecorators(UsePipes(new ZodValidationPipe(schema)));
