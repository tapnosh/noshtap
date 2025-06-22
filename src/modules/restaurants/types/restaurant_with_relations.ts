import { Prisma } from "@prisma/client";

export type RestaurantWithRelations = Prisma.RestaurantGetPayload<{
    include: {
        theme: true,
        address: true,
        images: true,
        categories: {
            include: {
                category: true,
            }
        },
        menus: {
            where: {
                is_deleted: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 1,
        },
    }
}>;
