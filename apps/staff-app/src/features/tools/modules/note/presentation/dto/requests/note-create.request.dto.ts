import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class NoteCreateRequestDto {
  @ApiProperty({ example: 'product', description: 'The kind of thing the note is about' })
  @IsString()
  @Matches(/^[a-z][a-z-]{1,63}$/, { message: 'subjectType must be lowercase letters and dashes' })
  public subjectType: string;

  @ApiProperty({ example: '42', description: 'An opaque id within that kind, never a foreign key' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  public subjectId: string;

  @ApiPropertyOptional({
    example: 'Refund call',
    description: 'At most 100 characters; when left out or blank, the start of the body',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  public title?: string;

  @ApiProperty({ example: 'Customer called about this; refunded manually.' })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  public body: string;
}
