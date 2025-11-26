import { IsString, MaxLength, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAddressDto {
    /**
     * Full formatted address from frontend (e.g. from Google API)
     * @example "Długa 5, 60-100 Poznań, Wielkopolskie, Polska"
     */
    @IsString()
    @MaxLength(255)
    formattedAddress: string;

    /**
     * Street name
     * @example "Długa"
     */
    @IsString()
    @MaxLength(50)
    street: string;

    /**
     * Street number
     * @example "5"
     */
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    streetNumber: string;

    /**
     * City / locality
     * @example "Poznań"
     */
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    city: string;

    /**
     * State / region
     * @example "Wielkopolskie"
     */
    @IsString()
    @MaxLength(100)
    state: string;

    /**
     * State code
     * @example "WP"
     */
    @IsString()
    @MaxLength(20)
    stateCode: string;

    /**
     * Country
     * @example "Polska"
     */
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    country: string;

    /**
     * Country code
     * @example "PL"
     */
    @IsString()
    @MaxLength(10)
    countryCode: string;

    /**
     * Postal code
     * @example "60-100"
     */
    @IsString()
    @MaxLength(10)
    postalCode: string;

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