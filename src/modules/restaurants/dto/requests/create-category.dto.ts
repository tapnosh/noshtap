import { IsString, MaxLength, IsEnum } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
    /**
     * The name of the category
     * @example "Italian"
     */
    @IsString()
    @MaxLength(255)
    name: string;

    /**
     * The description of the category
     * @example "Italian cuisine"
     */
    @IsString()
    description: string;

    /**
     * The type of the category
     * @example "cuisine"
     */
    @IsEnum(CategoryType)
    type: CategoryType;
}