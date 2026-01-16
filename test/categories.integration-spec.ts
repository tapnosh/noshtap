import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { CategoryType } from '@prisma/client';

import { ClerkStrategy } from './../src/modules/auth/clerk.strategy';
import { GooglePlacesService } from './../src/modules/places/google-places.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

class MockClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
    constructor() {
        super();
    }

    async validate(req: any): Promise<any> {
        return { id: 'user_categories_test' };
    }
}

describe('CategoriesController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let createdCategoryId: string;

    const testCategoryName = 'Test Cuisine ' + Date.now();
    const mockUser = { id: 'user_categories_test' };

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

        // Cleanup
        await prisma.restaurantCategory.deleteMany({ where: { name: testCategoryName } });
    });

    afterAll(async () => {
        if (prisma) {
            await prisma.restaurantCategory.deleteMany({ where: { name: testCategoryName } });
            await prisma.restaurantCategory.deleteMany({ where: { name: 'Updated ' + testCategoryName } });
            await prisma.$disconnect();
        }
        await app.close();
    });

    it('/categories (POST) - should create a category', async () => {
        const createDto = {
            name: testCategoryName,
            description: 'Test Description',
            type: CategoryType.cuisine
        };

        const response = await request(app.getHttpServer())
            .post('/categories')
            .send(createDto)
            .expect(201);

        expect(response.body.name).toBe(testCategoryName);
        expect(response.body.id).toBeDefined();
        createdCategoryId = response.body.id;
    });

    it('/categories (GET) - should list categories', async () => {
        const response = await request(app.getHttpServer())
            .get('/categories')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const found = response.body.find(c => c.id === createdCategoryId);
        expect(found).toBeDefined();
    });

    it('/categories/:id (POST) - should update a category', async () => {
        // Note: Controller uses @Post(':id') for update based on my reading of CategoriesController
        const updateDto = {
            name: 'Updated ' + testCategoryName,
            description: 'Updated Description',
            type: CategoryType.cuisine
        };

        const response = await request(app.getHttpServer())
            .post(`/categories/${createdCategoryId}`)
            .send(updateDto)
            .expect(201); // Controller returns Promise<RestaurantCategory>, so likely 201 by default for POST

        expect(response.body.name).toBe('Updated ' + testCategoryName);
    });

    it('/categories/:id (DELETE) - should delete a category', async () => {
        await request(app.getHttpServer())
            .delete(`/categories/${createdCategoryId}`)
            .expect(200);

        // Verify it's gone
        // GET /categories might not show it
        const response = await request(app.getHttpServer())
            .get('/categories')
            .expect(200);

        const found = response.body.find(c => c.id === createdCategoryId);
        expect(found).toBeUndefined();
    });
});
