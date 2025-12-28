import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ClerkStrategy } from './../src/modules/auth/clerk.strategy';
import { GooglePlacesService } from './../src/modules/places/google-places.service';
import { PrismaService } from './../src/prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

class MockClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
    constructor() {
        super();
    }

    async validate(req: any): Promise<any> {
        return { id: 'user_123' };
    }
}

describe('MenusController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let restaurantId: string;

    const mockUser = { id: 'user_123' };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(ClerkStrategy)
            .useClass(MockClerkStrategy)
            .overrideProvider('ClerkClient')
            .useValue({
                users: {
                    getUser: jest.fn().mockResolvedValue(mockUser)
                }
            })
            .overrideProvider(GooglePlacesService)
            .useValue({
                findPlace: jest.fn(),
                getPlaceDetails: jest.fn()
            })
            .compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();

        // Clean up previous runs
        const existingRestaurants = await prisma.restaurant.findMany({ where: { ownerId: mockUser.id } });
        for (const r of existingRestaurants) {
            await prisma.restaurantMenu.deleteMany({ where: { restaurant_id: r.id } });
        }
        await prisma.restaurant.deleteMany({ where: { ownerId: mockUser.id } });

        // Create a restaurant for testing
        const restaurant = await prisma.restaurant.create({
            data: {
                name: 'Test Restaurant',
                description: 'Test Description',
                slug: 'test-restaurant-' + Date.now(),
                ownerId: mockUser.id,
                theme: { create: { color: '#000000', ownerId: mockUser.id } },
            }
        });
        restaurantId = restaurant.id;
    });

    afterAll(async () => {
        // Cleanup
        if (prisma) {
            const restaurants = await prisma.restaurant.findMany({ where: { ownerId: mockUser.id } });
            for (const r of restaurants) {
                // Delete menus first because of FK constraint (no cascade on Restaurant -> RestaurantMenu)
                // But RestaurantMenu -> Headers/Groups has cascade, so deleteMany on RestaurantMenu is enough.
                // However, we need to make sure we delete all menus for this restaurant.
                // Actually, we can just delete all menus for these restaurants.
                await prisma.restaurantMenu.deleteMany({ where: { restaurant_id: r.id } });
            }
            await prisma.restaurant.deleteMany({ where: { ownerId: mockUser.id } });
            await prisma.$disconnect();
        }
        await app.close();
    });

    it('/restaurants/:id/menu (POST) - should create a menu', async () => {
        const createMenuDto = {
            name: 'Test Menu',
            schema: {
                header: [
                    { version: 'v1', type: 'heading', heading: 'Test Heading' }
                ],
                menu: [
                    {
                        version: 'v1',
                        type: 'menu-group',
                        name: 'Test Group',
                        timeFrom: new Date().toISOString(),
                        timeTo: new Date().toISOString(),
                        items: [
                            {
                                version: 'v1',
                                id: 'item_1',
                                name: 'Test Item',
                                price: { amount: 10, currency: 'USD' },
                                image: []
                            }
                        ]
                    }
                ]
            }
        };

        const response = await request(app.getHttpServer())
            .post(`/restaurants/${restaurantId}/menu`)
            .set('Authorization', 'Bearer mock_token')
            .send(createMenuDto)
            .expect(201);

        expect(response.body.name).toBe('Test Menu');
        expect(response.body.schema).toBeDefined();
        expect(response.body.schema.header).toHaveLength(1);
        expect(response.body.schema.header[0].heading).toBe('Test Heading');
        expect(response.body.schema.menu).toHaveLength(1);
        expect(response.body.schema.menu[0].items).toHaveLength(1);
        expect(response.body.schema.menu[0].items[0].name).toBe('Test Item');
    });

    it('/restaurants/:id/menu/:menuId (PUT) - should update a menu', async () => {
        // Create initial menu
        const createDto = {
            name: 'Original Menu',
            schema: { header: [], menu: [] }
        };
        const createRes = await request(app.getHttpServer())
            .post(`/restaurants/${restaurantId}/menu`)
            .set('Authorization', 'Bearer mock_token')
            .send(createDto)
            .expect(201);

        const menuId = createRes.body.id;

        // Update menu
        const updateDto = {
            name: 'Updated Menu',
            schema: {
                header: [{ version: 'v1', type: 'text', text: 'Updated Header' }],
                menu: []
            }
        };

        const response = await request(app.getHttpServer())
            .put(`/restaurants/${restaurantId}/menu/${menuId}`)
            .set('Authorization', 'Bearer mock_token')
            .send(updateDto)
            .expect(200);

        expect(response.body.name).toBe('Updated Menu');
        expect(response.body.schema.header).toHaveLength(1);
        expect(response.body.schema.header[0].text).toBe('Updated Header');
    });

    it('/restaurants/:id/menu (GET) - should list menus', async () => {
        const response = await request(app.getHttpServer())
            .get(`/restaurants/${restaurantId}/menu`)
            .set('Authorization', 'Bearer mock_token')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].schema).toBeDefined();
    });
});
