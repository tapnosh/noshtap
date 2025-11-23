import { IsString, MaxLength, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAddressDto {
    /**
     * Street with number
     * @example "ul. Długa 5"
     */
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    street: string;

    /**
     * Postal code
     * @example "60-100"
     */
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    postalCode: string;

    /**
     * City / locality
     * @example "Poznań"
     */
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    city: string;

    /**
     * Country
     * @example "Polska"
     */
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    country: string;

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