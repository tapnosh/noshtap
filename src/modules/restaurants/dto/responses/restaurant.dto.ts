import { Prisma } from "@prisma/client";
import { AddressDto } from "./address.dto";
import { CategoryDto } from "./category.dto";
import { ImageDto } from "./image.dto";
import { RestaurantThemeDto } from "./restaurant-theme.dto";
import { RestaurantWithRelations } from "../../types/restaurant_with_relations";

export class RestaurantDto {
    id: string;
    name: string;
    description: string;
    theme: RestaurantThemeDto;
    address?: AddressDto;
    images: ImageDto[];
    categories: CategoryDto[];

    isOwner?: boolean;

    static fromPrisma(restaurant: RestaurantWithRelations, userId?: string): RestaurantDto {
        return {
            id: restaurant.id,
            name: restaurant.name,
            description: restaurant.description,
            theme: {
                id: restaurant.theme.id,
                color: restaurant.theme.color,
            },
            address: !restaurant.address ? undefined : {
                id: restaurant.address.id,
                name: restaurant.address.name,
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
            isOwner: userId ? restaurant.ownerId === userId : undefined,
        };
    }
}