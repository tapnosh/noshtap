import { AddressDto } from "./address.dto";
import { CategoryDto } from "./category.dto";
import { ImageDto } from "./image.dto";
import { RestaurantThemeDto } from "./restaurant-theme.dto";
import { RestaurantWithRelations } from "../../types/restaurant_with_relations";
import { PriceRange } from "@prisma/client";

export class RestaurantDto {
    id: string;
    name: string;
    description: string;
    slug: string;
    theme: RestaurantThemeDto;
    address?: AddressDto;
    images: ImageDto[];
    categories: CategoryDto[];
    menu?: Record<string, any>;
    phoneNumber?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    reservationUrl?: string | null;
    priceRange?: PriceRange | null;
    isOwner?: boolean;

    static fromPrisma(restaurant: RestaurantWithRelations, userId?: string): RestaurantDto {
        return {
            id: restaurant.id,
            name: restaurant.name,
            description: restaurant.description,
            slug: restaurant.slug,
            theme: {
                id: restaurant.theme.id,
                color: restaurant.theme.color,
            },
            address: !restaurant.address ? undefined : {
                id: restaurant.address.id,
                formattedAddress: restaurant.address.name,
                street: restaurant.address.street,
                streetNumber: restaurant.address.streetNumber,
                city: restaurant.address.city,
                state: restaurant.address.state,
                country: restaurant.address.country,
                countryCode: restaurant.address.countryCode,
                postalCode: restaurant.address.postalCode,
                lat: Number(restaurant.address.lat),
                lng: Number(restaurant.address.lng)
            },
            images: restaurant.images.map((image) => {
                return {
                    url: image.image_url,
                    downloadUrl: image.download_url,
                    pathname: image.pathname,
                    contentType: image.content_type,
                    contentDisposition: image.content_disposition,
                };
            }),
            categories: restaurant.categories.map((category) => {
                return {
                    id: category.category.id,
                    name: category.category.name,
                    description: category.category.description,
                };
            }),
            menu: restaurant.menus[0]?.schema as Record<string, any>,
            phoneNumber: restaurant.phoneNumber,
            facebookUrl: restaurant.facebookUrl,
            instagramUrl: restaurant.instagramUrl,
            reservationUrl: restaurant.reservationUrl,
            priceRange: restaurant.priceRange,
            isOwner: userId ? restaurant.ownerId === userId : undefined,
        };
    }
}