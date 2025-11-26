import { IsArray, IsOptional, IsString, IsUUID, Matches, MaxLength, ValidateNested, IsUrl, IsEnum } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';
import { Type } from 'class-transformer';
import { CreateImageDto } from './create-image.dto';
import { PriceRange } from '@prisma/client';

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
  @IsOptional()
  theme_id?: string;

  /**
   * The theme hex color code 
   * [INFO] If theme_id is not provided this field is required
   * @example "#3B82F6"
   */
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Invalid HEX color code' })
  theme?: string;

  /**
   * The images of the restaurant
   * @example { "url": "https://example.com/image1.jpg", "downloadUrl": "https://example.com/image1.jpg", "pathname": "image1.jpg", "contentType": "image/jpeg", "contentDisposition": "inline" }
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images: CreateImageDto[];

  /**
   * The categories of the restaurant
   * @example ["20260cfc-d1b6-47c0-8946-01f0f238eaeb", "20260cfc-d1b6-47c0-8946-01f0f238eaeb"]
   */
  @IsArray()
  @IsString({ each: true })
  category_ids: string[];

  /**
   * The address of the restaurant
   * @example {
   *  "street": "ul. Długa 5",
   *  "postalCode": "60-100",
   *  "city": "Poznań",
   *  "country": "Polska",
   *  "lat": 52.406374,
   *  "lng": 16.925168
   * }
   */
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  /**
   * Contact phone number
   * @example "+48 123 456 789"
   */
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phoneNumber?: string;

  /**
   * Facebook page URL
   * @example "https://www.facebook.com/my-restaurant"
   */
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  /**
   * Instagram profile URL
   * @example "https://www.instagram.com/my-restaurant"
   */
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  /**
   * Reservation site URL
   * @example "https://www.zjedz.my/my-restaurant"
   */
  @IsOptional()
  @IsUrl()
  reservationUrl?: string;

  /**
   * The price range of the restaurant
   * @example "low" | "mid" | "high"
   */
  @IsEnum(PriceRange)
  @IsOptional()
  priceRange?: PriceRange;
}