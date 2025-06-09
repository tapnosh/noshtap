import { IsArray, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';
import { Type } from 'class-transformer';

export class CreateRestaurantDto {
  /**
   * The name of the restaurant
   * @example "Delicious Restaurant"
   */
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * The description of the restaurant
   * @example "A cozy place with amazing food"
   */
  @IsString()
  description: string;

  /**
   * The ID of the restaurant theme
   * [INFO] Has precedence over theme if provided
   * @example "20260cfc-d1b6-47c0-8946-01f0f238eaeb"
   */
  @IsUUID()
  theme_id?: string;

  /**
   * The theme hex color code 
   * [INFO] If theme_id is not provided this field is required
   * @example "#3B82F6"
   */
  @IsString()
  @MaxLength(255)
  theme?: string;

  /**
   * The images of the restaurant
   * @example ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
   */
  @IsArray()
  @IsString({ each: true })
  images: string[];

  /**
   * The categories of the restaurant
   * @example ["20260cfc-d1b6-47c0-8946-01f0f238eaeb", "20260cfc-d1b6-47c0-8946-01f0f238eaeb"]
   */
  @IsArray()
  @IsString({ each: true })
  category_ids: string[];

  /**
   * The address of the restaurant
   * @example { "name": "123 Main St", "lat": 37.774929, "lng": -122.419416 }
   */
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}