import { BadRequestException, type ArgumentMetadata } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';

import { StrictValidationPipe } from '../strict-validation.pipe';

describe('StrictValidationPipe', () => {
  it('transforms the body into the DTO with typed fields', async () => {
    class CreateItemDto {
      @IsString()
      public title: string;

      @Type(() => Number)
      @IsInt()
      public quantity: number;
    }

    const metadata: ArgumentMetadata = { type: 'body', metatype: CreateItemDto };

    const value: unknown = await new StrictValidationPipe().transform(
      { title: 'Lamp', quantity: '3' },
      metadata,
    );

    expect(value).toBeInstanceOf(CreateItemDto);
    expect(value).toEqual({ title: 'Lamp', quantity: 3 });
  });

  it('rejects a field the DTO does not declare', async () => {
    class CreateItemDto {
      @IsString()
      public title: string;
    }

    const metadata: ArgumentMetadata = { type: 'body', metatype: CreateItemDto };

    const transformed = new StrictValidationPipe().transform(
      { title: 'Lamp', ownerId: 'other' },
      metadata,
    );

    await expect(transformed).rejects.toBeInstanceOf(BadRequestException);
    await expect(transformed).rejects.toMatchObject({
      response: {
        statusCode: 400,
        code: 'VALIDATION_FAILED',
        message: 'The request is not valid',
        details: {
          fields: [{ field: 'ownerId', messages: ['property ownerId should not exist'] }],
        },
      },
    });
  });

  it('names a refused field inside a nested object by its path', async () => {
    class ItemDimensionsDto {
      @IsInt()
      public width: number;
    }

    class CreateItemDto {
      @IsString()
      public title: string;

      @ValidateNested()
      @Type(() => ItemDimensionsDto)
      public dimensions: ItemDimensionsDto;
    }

    const metadata: ArgumentMetadata = { type: 'body', metatype: CreateItemDto };

    const transformed = new StrictValidationPipe().transform(
      { title: 7, dimensions: { width: 'wide' } },
      metadata,
    );

    await expect(transformed).rejects.toMatchObject({
      response: {
        details: {
          fields: [
            { field: 'title', messages: ['title must be a string'] },
            { field: 'dimensions.width', messages: ['width must be an integer number'] },
          ],
        },
      },
    });
  });
});
