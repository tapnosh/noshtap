import { Decimal } from '@prisma/client/runtime/library';
import { IsString, MaxLength, IsNotEmpty, IsNumber, IsDecimal } from 'class-validator';

export class CreateAddressDto {
    /**
     * The name of the address
     * @example "123 Main St"
     */
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    /**
     * The latitude of the address
     * @example 37.774929
     */
    @IsNumber()
    lat: number;

    /**
     * The longitude of the address
     * @example -122.419416
     */
    @IsNumber()
    lng: number;
}