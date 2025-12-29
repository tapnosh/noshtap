import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRestaurantDto } from "../dto/requests/create-restaurant.dto";
import { UpdateRestaurantDto } from "../dto/requests/update-restaurant.dto";
import { Prisma, CategoryType } from "@prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { kRestaurantWithRelationsInclude, RestaurantWithRelations } from "../types/restaurant_with_relations";

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async create(createRestaurantDto: CreateRestaurantDto, userId: string, randomSuffix: boolean = false): Promise<RestaurantWithRelations> {
        const { formattedAddress, street, streetNumber, city, state, country, countryCode, postalCode, lat, lng, } = createRestaurantDto.address;
        const data: Prisma.RestaurantCreateInput = {
            slug: this.createSlug(createRestaurantDto.name, randomSuffix),
            ownerId: userId,
            name: createRestaurantDto.name,
            description: createRestaurantDto.description,
            theme: this.getTheme(createRestaurantDto.theme_id, createRestaurantDto.theme, userId),
            phoneNumber: createRestaurantDto.phoneNumber,
            facebookUrl: createRestaurantDto.facebookUrl,
            instagramUrl: createRestaurantDto.instagramUrl,
            reservationUrl: createRestaurantDto.reservationUrl,
            priceRange: createRestaurantDto.priceRange ?? undefined,
            address: {
                create: {
                    name: formattedAddress,
                    street: street,
                    streetNumber: streetNumber,
                    city: city,
                    state: state,
                    country: country,
                    countryCode: countryCode,
                    postalCode,
                    lat: lat,
                    lng: lng
                },
            },

            images: {
                create: createRestaurantDto.images.map((image) => ({
                    image_url: image.url,
                    download_url: image.downloadUrl,
                    pathname: image.pathname,
                    content_type: image.contentType,
                    content_disposition: image.contentDisposition,
                })),
            },
            categories: {
                create: createRestaurantDto.category_ids.map((id) => ({
                    category: { connect: { id } },
                })),
            },
        };

        try {
            const restaurant = await this.prisma.restaurant.create({ data: data, include: kRestaurantWithRelationsInclude });

            return restaurant;
        } catch (error) {
            if (this.isSlugConflictError(error)) {
                return this.create(createRestaurantDto, userId, true);
            }

            throw error;
        }
    }

    async update(
        id: string,
        dto: UpdateRestaurantDto,
        userId: string,
        randomSuffix: boolean = false,
    ): Promise<RestaurantWithRelations> {
        // TODO: Refactor with race condition in mind
        const restaurant = await this.prisma.restaurant.findFirst({
            where: {
                id,
                is_deleted: false,
            },
            include: { images: true, categories: true },
        });

        if (!restaurant) {
            throw new NotFoundException('The restaurant does not exist.');
        }

        if (restaurant.ownerId !== userId) {
            throw new ForbiddenException('You do not have access to this restaurant.');
        }

        const addressData = dto.address
            ? {
                update: {
                    name: dto.address.formattedAddress,
                    street: dto.address.street,
                    streetNumber: dto.address.streetNumber,
                    city: dto.address.city,
                    state: dto.address.state,
                    country: dto.address.country,
                    countryCode: dto.address.countryCode,
                    postalCode: dto.address.postalCode,
                    lat: dto.address.lat,
                    lng: dto.address.lng,
                },
            }
            : undefined;

        const data: Prisma.RestaurantUpdateInput = {
            name: dto.name,
            slug: this.createSlug(dto.name, randomSuffix),
            description: dto.description,
            priceRange: dto.priceRange,
            theme: { connect: { id: dto.theme_id } }, //theme id is optional should we fix it? fx. theme: dto.theme_id ? { connect: { id: dto.theme_id } } : undefined,
            phoneNumber: dto.phoneNumber,
            facebookUrl: dto.facebookUrl,
            instagramUrl: dto.instagramUrl,
            reservationUrl: dto.reservationUrl,
            images: {
                disconnect: restaurant.images.length > 0 ? restaurant.images.map((img) => ({ id: img.id })) : undefined,
                create: dto.images.map((image) => ({
                    image_url: image.url,
                    download_url: image.downloadUrl,
                    pathname: image.pathname,
                    content_type: image.contentType,
                    content_disposition: image.contentDisposition,
                })),
            },
            categories: {
                disconnect: restaurant.categories.length > 0 ? restaurant.categories.map((cat) => ({
                    id: cat.id,
                })) : undefined,
                create: dto.category_ids.map((categoryId) => ({
                    category: {
                        connect: { id: categoryId },
                    },
                })),
            },
            address: addressData,
        };

        try {
            const restaurant = await this.prisma.restaurant.update({
                where: { id },
                data: data,
                include: kRestaurantWithRelationsInclude,
            });

            return restaurant;

        } catch (error) {
            if (this.isSlugConflictError(error)) {
                return this.update(id, dto, userId, true);
            }

            throw error;
        }
    }

    async delete(
        id: string,
        userId: string,
    ): Promise<void> {
        const restaurant = await this.prisma.restaurant.update({
            where: { id, ownerId: userId },
            data: { is_deleted: true },
            include: kRestaurantWithRelationsInclude
        });

        if (!restaurant) {
            throw new NotFoundException('The restaurant does not exist or you do not have access to it.');
        }
    }

    async findAll(): Promise<RestaurantWithRelations[]> {
        return this.prisma.restaurant.findMany({
            where: { is_deleted: false },
            include: kRestaurantWithRelationsInclude
        });
    }

    async findAllForUser(userId: string): Promise<RestaurantWithRelations[]> {
        return this.prisma.restaurant.findMany({
            where: { is_deleted: false, ownerId: userId },
            include: kRestaurantWithRelationsInclude
        });
    }

    async findAllWithLocation(
        lat: number,
        lng: number,
        radiusKm: number,
        cuisineTypeId?: string,
    ): Promise<RestaurantWithRelations[]> {
        let where: Prisma.RestaurantWhereInput = {
            is_deleted: false,
        };

        const { minLat, maxLat, minLng, maxLng } = this.getBoundingBox(
            lat,
            lng,
            radiusKm,
        );

        where = {
            ...where,
            address: {
                lat: { gte: minLat, lte: maxLat },
                lng: { gte: minLng, lte: maxLng },
            },
        };

        if (cuisineTypeId) {
            where = {
                ...where,
                categories: {
                    some: {
                        category: {
                            id: cuisineTypeId,
                            type: CategoryType.cuisine,
                        },
                    },
                },
            };
        };


        const restaurants = await this.prisma.restaurant.findMany({
            where,
            include: kRestaurantWithRelationsInclude,
        });

        const filtered = restaurants
            .map((restaurant) => {
                if (!restaurant.address) return null;

                const distance = this.calculateDistanceKm(
                    lat,
                    lng,
                    Number(restaurant.address.lat),
                    Number(restaurant.address.lng),
                );

                return { restaurant, distance };
            })
            .filter(
                (item): item is { restaurant: RestaurantWithRelations, distance: number } =>
                    !!item && item.distance <= radiusKm,
            )
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 100)
            .map((item) => item.restaurant);

        return filtered;
    }

    async findById(id: string, userId: string): Promise<RestaurantWithRelations | null> {
        return this.prisma.restaurant.findUnique({
            where: {
                id,
                ownerId: userId,
                is_deleted: false
            },
            include: kRestaurantWithRelationsInclude
        });
    }

    async findBySlug(slug: string, userId?: string): Promise<RestaurantWithRelations | null> {
        const where = userId
            ? { slug, is_deleted: false, ownerId: userId }
            : { slug, is_deleted: false };

        return this.prisma.restaurant.findUnique({
            where,
            include: kRestaurantWithRelationsInclude
        });
    }

    private getTheme(theme_id: string | undefined, theme: string | undefined, userId: string): Prisma.RestaurantThemeCreateNestedOneWithoutRestaurantsInput {
        if (theme_id) {
            return { connect: { id: theme_id } };
        }

        return { create: { color: theme!, ownerId: userId } };
    }

    private createSlug(name: string, randomSuffix: boolean = false): string {
        const slug = name
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (randomSuffix) {
            return `${slug}-${this.generateRandomSuffix()}`;
        }
        return slug;
    }

    private generateRandomSuffix(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    private getBoundingBox(lat: number, lng: number, radiusKm: number) {
        const earthRadiusKm = 6371;

        const dLat = (radiusKm / earthRadiusKm) * (180 / Math.PI);
        const dLng = dLat / Math.cos((lat * Math.PI) / 180);

        return {
            minLat: lat - dLat,
            maxLat: lat + dLat,
            minLng: lng - dLng,
            maxLng: lng + dLng,
        };
    }

    private calculateDistanceKm(
        lat1: number,
        lng1: number,
        lat2: number,
        lng2: number,
    ): number {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private isSlugConflictError(error: any): boolean {
        return error.code === 'P2002' && error.meta?.target?.includes('slug');
    }
}