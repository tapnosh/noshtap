import { IsArray, IsString, IsUUID, MaxLength } from 'class-validator';
import { CreateImageDto } from './create-image.dto';

export class UpdateRestaurantDto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsString()
    description: string;

    @IsUUID()
    theme_id: string;

    @IsArray()
    @IsString({ each: true })
    images: CreateImageDto[];

    @IsArray()
    @IsString({ each: true })
    category_ids: string[];
}