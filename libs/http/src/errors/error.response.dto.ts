import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiResponseProperty({ example: 404 })
  public statusCode: number;

  @ApiProperty({
    readOnly: true,
    example: 'PRODUCT_NOT_FOUND',
    description:
      'The code of the module that refused, VALIDATION_FAILED, the code of a refused header, or the name of the HTTP status',
  })
  public code: string;

  @ApiResponseProperty({ example: 'Product 12 was not found' })
  public message: string;

  @ApiProperty({
    readOnly: true,
    nullable: true,
    type: 'object',
    additionalProperties: true,
    example: { currentVersion: 4 },
    description: 'What the code adds: the refused fields, the current version, the missing ids',
  })
  public details: Readonly<Record<string, unknown>> | null;
}
