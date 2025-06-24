import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRestaurantDto } from "../dto/requests/create-restaurant.dto";
import { UpdateRestaurantDto } from "../dto/requests/update-restaurant.dto";
import { Prisma } from "@prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { kRestaurantWithRelationsInclude, RestaurantWithRelations } from "../types/restaurant_with_relations";

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async create(createRestaurantDto: CreateRestaurantDto, userId: string, randomSuffix: boolean = false): Promise<RestaurantWithRelations> {
        const data: Prisma.RestaurantCreateInput = {
            slug: this.createSlug(createRestaurantDto.name, randomSuffix),
            ownerId: userId,
            name: createRestaurantDto.name,
            description: createRestaurantDto.description,
            theme: this.getTheme(createRestaurantDto.theme_id, createRestaurantDto.theme, userId),
            address: createRestaurantDto.address ? {
                create: {
                    name: createRestaurantDto.address.name,
                    lat: createRestaurantDto.address.lat,
                    lng: createRestaurantDto.address.lng,
                }
            } : undefined,
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

        const data: Prisma.RestaurantUpdateInput = {
            name: dto.name,
            slug: this.createSlug(dto.name, randomSuffix),
            description: dto.description,
            theme: { connect: { id: dto.theme_id } },
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
            address: {
                update: dto.address ? {
                    name: dto.address.name,
                    lat: dto.address.lat,
                    lng: dto.address.lng
                } : undefined,
                disconnect: dto.address ? undefined : true,
            }
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
            .replace(/[\s_-]+/g, '-d')
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

    private isSlugConflictError(error: any): boolean {
        return error.code === 'P2002' && error.meta?.target?.includes('slug');
    }
}