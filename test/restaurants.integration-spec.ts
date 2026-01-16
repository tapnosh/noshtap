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
        return { id: 'user_restaurants_test' };
    }
}

describe('RestaurantsController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let createdRestaurantId: string;

    const mockUser = { id: 'user_restaurants_test' };

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
            await prisma.restaurantAddress.deleteMany({ where: { restaurant_id: r.id } });
        }
        await prisma.restaurant.deleteMany({ where: { ownerId: mockUser.id } });
    });

    afterAll(async () => {
        if (prisma) {
            // Cleanup
            const restaurants = await prisma.restaurant.findMany({ where: { ownerId: mockUser.id } });
            for (const r of restaurants) {
                await prisma.restaurantMenu.deleteMany({ where: { restaurant_id: r.id } });
                await prisma.restaurantAddress.deleteMany({ where: { restaurant_id: r.id } });
            }
            // If RestaurantAddress prevents delete, we assume it's created alongside restaurant.
            // But if it's one-to-one, we might need to delete it.
            // Let's try deleting generally.
            await prisma.restaurant.deleteMany({ where: { ownerId: mockUser.id } });
            await prisma.$disconnect();
        }
        await app.close();
    });

    it('/restaurants (POST) - should create a restaurant', async () => {
        const createDto = {
            name: 'New Restaurant',
            description: 'New Description',
            slug: 'new-restaurant-' + Date.now(),
            theme: '#FFFFFF',
            images: [],
            category_ids: [],
            address: {
                street: 'Test Street 1',
                streetNumber: '1',
                postalCode: '00-000',
                state: 'Test State',
                countryCode: 'PL',
                city: 'Test City',
                country: 'Test Country',
                lat: 0,
                lng: 0,
                placeId: 'test_place_id',
                formattedAddress: 'Test Street 1, 00-000 Test City'
            }
        };

        const response = await request(app.getHttpServer())
            .post('/restaurants')
            .set('Authorization', 'Bearer mock_token')
            .send(createDto)
            .expect(201);

        expect(response.body.name).toBe('New Restaurant');
        expect(response.body.id).toBeDefined();
        createdRestaurantId = response.body.id;
    });

    it('/restaurants (GET) - should list restaurants', async () => {
        const response = await request(app.getHttpServer())
            .get('/restaurants')
            .set('Authorization', 'Bearer mock_token')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const found = response.body.find(r => r.id === createdRestaurantId);
        expect(found).toBeDefined();
    });

    it('/restaurants/:id (GET) - should get a restaurant by id', async () => {
        const response = await request(app.getHttpServer())
            .get(`/restaurants/${createdRestaurantId}`)
            .set('Authorization', 'Bearer mock_token')
            .expect(200);

        expect(response.body.id).toBe(createdRestaurantId);
        expect(response.body.name).toBe('New Restaurant');
    });

    it('/restaurants/:id (PUT) - should update a restaurant', async () => {
        const updateDto = {
            name: 'Updated Restaurant Name',
            description: 'Updated Description',
            images: [],
            category_ids: []
        };

        const response = await request(app.getHttpServer())
            .put(`/restaurants/${createdRestaurantId}`)
            .set('Authorization', 'Bearer mock_token')
            .send(updateDto)
            .expect(200);

        expect(response.body.name).toBe('Updated Restaurant Name');
    });

    it('/restaurants/:id (DELETE) - should delete a restaurant', async () => {
        await request(app.getHttpServer())
            .delete(`/restaurants/${createdRestaurantId}`)
            .set('Authorization', 'Bearer mock_token')
            .expect(200);

        // Verify it's gone
        await request(app.getHttpServer())
            .get(`/restaurants/${createdRestaurantId}`)
            .set('Authorization', 'Bearer mock_token')
            .expect(404);
    });
});
