import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class NoteUpdateRequestDto {
  @ApiPropertyOptional({
    example: 'Refund call',
    description: 'At most 100 characters; when left out or blank, the title stays',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  public title?: string;

  @ApiProperty({ example: 'Customer called twice; refunded manually on the second call.' })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  public body: string;
}
