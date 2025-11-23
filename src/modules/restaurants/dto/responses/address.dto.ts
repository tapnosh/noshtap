export class AddressDto {
    id: string;
    formattedAddress: string;
    street?: string | null;
    streetNumber?: string | null;
    city?: string | null;
    state?: string | null;
    stateCode?: string | null;
    country?: string | null;
    countryCode?: string | null;
    postalCode?: string | null;
    lat: number;
    lng: number;
}