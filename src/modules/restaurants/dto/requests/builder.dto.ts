import {
  IsArray,
  IsString,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsUrl,
  IsPositive,
  Length,
  MaxLength,
  MinLength,
  ArrayMaxSize,
  IsDateString,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PriceDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  currency: string;
}

export class RestaurantCategoryDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class BuilderMenuItemImageDto {
  @IsString()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  downloadUrl?: string;

  @IsOptional()
  @IsString()
  pathname?: string;

  @IsOptional()
  @IsString()
  contentType?: string;

  @IsOptional()
  @IsString()
  contentDisposition?: string;
}

export class BuilderMenuItemDto {
  @IsEnum(['v1'])
  version: 'v1';

  @IsString()
  id: string;

  @IsString()
  @Length(1, 80)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestaurantCategoryDto)
  @ArrayMaxSize(10)
  allergens?: RestaurantCategoryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestaurantCategoryDto)
  @ArrayMaxSize(10)
  food_types?: RestaurantCategoryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BuilderMenuItemImageDto)
  @ArrayMaxSize(1)
  image?: BuilderMenuItemImageDto[];

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsDateString()
  disabledFrom?: string | null;

  @IsOptional()
  @IsDateString()
  disabledUntil?: string | null;
}

export class BuilderMenuGroupDto {
  @IsEnum(['v1'])
  version: 'v1';

  @IsEnum(['menu-group'])
  type: 'menu-group';

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'timeFrom must be in HH:MM format',
  })
  timeFrom: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'timeTo must be in HH:MM format',
  })
  timeTo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BuilderMenuItemDto)
  items: BuilderMenuItemDto[];
}

export class BuilderHeaderTextDto {
  @IsEnum(['v1'])
  version: 'v1';

  @IsEnum(['text'])
  type: 'text';

  @IsString()
  text: string;
}

export class BuilderHeaderHeadingDto {
  @IsEnum(['v1'])
  version: 'v1';

  @IsEnum(['heading'])
  type: 'heading';

  @IsString()
  heading: string;
}

export class BuilderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    // Transform each header element to the appropriate DTO class based on type
    return value?.map((item: any) => {
      if (item?.type === 'text') {
        return Object.assign(new BuilderHeaderTextDto(), item);
      } else if (item?.type === 'heading') {
        return Object.assign(new BuilderHeaderHeadingDto(), item);
      }
      return item;
    });
  })
  @Type(() => Object)
  header: (BuilderHeaderTextDto | BuilderHeaderHeadingDto)[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BuilderMenuGroupDto)
  menu: BuilderMenuGroupDto[];
}

