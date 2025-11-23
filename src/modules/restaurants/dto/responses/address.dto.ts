export class AddressDto {
    id: string;
    name: string;
    street?: string | null;
    postalCode?: string | null;
    city?: string | null;
    country?: string | null;
    lat: number;
    lng: number;
}