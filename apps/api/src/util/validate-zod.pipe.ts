import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Schema, ZodError } from 'zod'

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any) {
    try {
      this.schema.parse(value)
      return value
    } catch(err) {
      if (err instanceof ZodError) {
        // console.log(err)
        throw new BadRequestException({ message: err.flatten().fieldErrors });
      }
      
      throw new BadRequestException('Validation error');
    }
  }
}