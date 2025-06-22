import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
    /**
     * The name of the category
     * @example "Italian"
     */
    @IsString()
    @MaxLength(255)
    @IsOptional()
    name?: string;

    /**
     * The description of the category
     * @example "Italian cuisine"
     */
    @IsString()
    @IsOptional()
    description?: string;
}