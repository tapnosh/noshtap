import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThemeDto {
  @ApiProperty({
    example: '#3B82F6',
    description: 'Hex color code for the theme',
  })
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Invalid HEX color code' })
  color: string;
}
