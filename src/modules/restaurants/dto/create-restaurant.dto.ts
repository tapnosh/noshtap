import { IsString, IsUUID, MaxLength } from 'class-validator';

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
}