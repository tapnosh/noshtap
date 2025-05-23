import { IsString, MaxLength } from 'class-validator';

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
}