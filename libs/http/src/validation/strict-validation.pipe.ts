import {
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationPipe,
  type ValidationError,
} from '@nestjs/common';

@Injectable()
export class StrictValidationPipe extends ValidationPipe {
  public static readonly CODE = 'VALIDATION_FAILED';

  private static readonly MESSAGE = 'The request is not valid';

  constructor() {
    super({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => StrictValidationPipe.toException(errors),
    });
  }

  private static toException(errors: ValidationError[]): BadRequestException {
    const statusCode = HttpStatus.BAD_REQUEST;
    const fields = StrictValidationPipe.toFields(errors, '');

    return new BadRequestException({
      statusCode,
      code: StrictValidationPipe.CODE,
      message: StrictValidationPipe.MESSAGE,
      details: { fields },
    });
  }

  private static toFields(
    errors: ValidationError[],
    parent: string,
  ): { field: string; messages: string[] }[] {
    return errors.flatMap((error) => {
      const field = parent === '' ? error.property : `${parent}.${error.property}`;
      const messages = Object.values(error.constraints ?? {});
      const ownFields = messages.length > 0 ? [{ field, messages }] : [];
      const childFields = StrictValidationPipe.toFields(error.children ?? [], field);

      return [...ownFields, ...childFields];
    });
  }
}
