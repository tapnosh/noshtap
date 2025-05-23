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
   * @example "20260cfc-d1b6-47c0-8946-01f0f238eaeb"
   */
  @IsUUID()
  theme_id: string;

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