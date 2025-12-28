import { BuilderDto, BuilderHeaderHeadingDto, BuilderHeaderTextDto, BuilderMenuGroupDto, BuilderMenuItemDto, BuilderMenuItemImageDto, PriceDto, RestaurantCategoryDto } from "../dto/requests/builder.dto";
import { MenuHeader, MenuGroup, MenuItem, MenuItemAllergen, MenuItemCategory, MenuItemFoodType, MenuItemImage, MenuItemIngredient, RestaurantMenu } from "@prisma/client";

type FullMenu = RestaurantMenu & {
    headers: MenuHeader[];
    groups: (MenuGroup & {
        items: (MenuItem & {
            image: MenuItemImage | null;
            allergens: MenuItemAllergen[];
            foodTypes: MenuItemFoodType[];
            ingredients: MenuItemIngredient[];
            categories: MenuItemCategory[];
        })[];
    })[];
};

export class MenuMapper {

    static mapToDbCreate(schema: BuilderDto) {
        return {
            headers: {
                create: schema.header.map((h, index) => ({
                    version: h.version,
                    type: h.type === 'text' ? 'text' : 'heading' as any, // Cast to enum if needed
                    text: h.type === 'text' ? (h as BuilderHeaderTextDto).text : undefined,
                    heading: h.type === 'heading' ? (h as BuilderHeaderHeadingDto).heading : undefined,
                    order: index,
                }))
            },
            groups: {
                create: schema.menu.map((g, index) => ({
                    version: g.version,
                    type: g.type,
                    name: g.name,
                    timeFrom: new Date(g.timeFrom),
                    timeTo: new Date(g.timeTo),
                    order: index,
                    items: {
                        create: g.items.map((item, itemIndex) => ({
                            version: item.version,
                            item_id: item.id,
                            name: item.name,
                            description: item.description,
                            price_amount: item.price.amount,
                            price_currency: item.price.currency,
                            confirmed: item.confirmed,
                            order: itemIndex,
                            image: item.image && item.image.length > 0 ? {
                                create: {
                                    url: item.image[0].url,
                                    downloadUrl: item.image[0].downloadUrl,
                                    pathname: item.image[0].pathname,
                                    contentType: item.image[0].contentType,
                                    contentDisposition: item.image[0].contentDisposition,
                                }
                            } : undefined,
                            allergens: {
                                create: item.allergens?.map((a, i) => ({
                                    allergen_id: a.id,
                                    name: a.name,
                                    description: a.description,
                                    order: i
                                }))
                            },
                            foodTypes: {
                                create: item.food_types?.map((f, i) => ({
                                    food_type_id: f.id,
                                    name: f.name,
                                    description: f.description,
                                    order: i
                                }))
                            },
                            ingredients: {
                                create: item.ingredients?.map((ing, i) => ({
                                    ingredient: ing,
                                    order: i
                                }))
                            },
                            categories: {
                                create: item.categories?.map((c, i) => ({
                                    category: c,
                                    order: i
                                }))
                            }
                        }))
                    }
                }))
            }
        };
    }

    static mapToDbUpdate(schema: BuilderDto) {
        return {
            headers: {
                deleteMany: {},
                create: schema.header.map((h, index) => ({
                    version: h.version,
                    type: h.type === 'text' ? 'text' : 'heading' as any,
                    text: h.type === 'text' ? (h as BuilderHeaderTextDto).text : undefined,
                    heading: h.type === 'heading' ? (h as BuilderHeaderHeadingDto).heading : undefined,
                    order: index,
                }))
            },
            groups: {
                deleteMany: {},
                create: schema.menu.map((g, index) => ({
                    version: g.version,
                    type: g.type,
                    name: g.name,
                    timeFrom: new Date(g.timeFrom),
                    timeTo: new Date(g.timeTo),
                    order: index,
                    items: {
                        create: g.items.map((item, itemIndex) => ({
                            version: item.version,
                            item_id: item.id,
                            name: item.name,
                            description: item.description,
                            price_amount: item.price.amount,
                            price_currency: item.price.currency,
                            confirmed: item.confirmed,
                            order: itemIndex,
                            image: item.image && item.image.length > 0 ? {
                                create: {
                                    url: item.image[0].url,
                                    downloadUrl: item.image[0].downloadUrl,
                                    pathname: item.image[0].pathname,
                                    contentType: item.image[0].contentType,
                                    contentDisposition: item.image[0].contentDisposition,
                                }
                            } : undefined,
                            allergens: {
                                create: item.allergens?.map((a, i) => ({
                                    allergen_id: a.id,
                                    name: a.name,
                                    description: a.description,
                                    order: i
                                }))
                            },
                            foodTypes: {
                                create: item.food_types?.map((f, i) => ({
                                    food_type_id: f.id,
                                    name: f.name,
                                    description: f.description,
                                    order: i
                                }))
                            },
                            ingredients: {
                                create: item.ingredients?.map((ing, i) => ({
                                    ingredient: ing,
                                    order: i
                                }))
                            },
                            categories: {
                                create: item.categories?.map((c, i) => ({
                                    category: c,
                                    order: i
                                }))
                            }
                        }))
                    }
                }))
            }
        };
    }

    static mapFromDb(menu: FullMenu): BuilderDto {
        const header = menu.headers
            .sort((a, b) => a.order - b.order)
            .map(h => {
                if (h.type === 'text') {
                    return {
                        version: h.version as 'v1',
                        type: 'text' as const,
                        text: h.text || '',
                    };
                } else {
                    return {
                        version: h.version as 'v1',
                        type: 'heading' as const,
                        heading: h.heading || '',
                    };
                }
            });

        const menuGroups = menu.groups
            .sort((a, b) => a.order - b.order)
            .map(g => {
                const items = g.items
                    .sort((a, b) => a.order - b.order)
                    .map(item => {
                        const price: PriceDto = {
                            amount: Number(item.price_amount),
                            currency: item.price_currency,
                        };

                        const allergens: RestaurantCategoryDto[] = item.allergens
                            .sort((a, b) => a.order - b.order)
                            .map(a => ({
                                id: a.allergen_id,
                                name: a.name,
                                description: a.description,
                            }));

                        const food_types: RestaurantCategoryDto[] = item.foodTypes
                            .sort((a, b) => a.order - b.order)
                            .map(f => ({
                                id: f.food_type_id,
                                name: f.name,
                                description: f.description,
                            }));

                        const image: BuilderMenuItemImageDto[] = item.image ? [{
                            url: item.image.url,
                            downloadUrl: item.image.downloadUrl || undefined,
                            pathname: item.image.pathname || undefined,
                            contentType: item.image.contentType || undefined,
                            contentDisposition: item.image.contentDisposition || undefined,
                        }] : [];

                        const ingredients = item.ingredients
                            .sort((a, b) => a.order - b.order)
                            .map(i => i.ingredient);

                        const categories = item.categories
                            .sort((a, b) => a.order - b.order)
                            .map(c => c.category);

                        const builderItem: BuilderMenuItemDto = {
                            version: item.version as 'v1',
                            id: item.item_id,
                            name: item.name,
                            description: item.description || undefined,
                            price,
                            allergens: allergens.length > 0 ? allergens : undefined,
                            food_types: food_types.length > 0 ? food_types : undefined,
                            image: image.length > 0 ? image : undefined,
                            confirmed: item.confirmed || undefined,
                            ingredients: ingredients.length > 0 ? ingredients : undefined,
                            categories: categories.length > 0 ? categories : undefined,
                        };
                        return builderItem;
                    });

                const group: BuilderMenuGroupDto = {
                    version: g.version as 'v1',
                    type: 'menu-group',
                    name: g.name,
                    timeFrom: g.timeFrom.toISOString(),
                    timeTo: g.timeTo.toISOString(),
                    items,
                };
                return group;
            });

        return {
            header,
            menu: menuGroups,
        };
    }
}
