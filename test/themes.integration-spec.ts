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
        return { id: 'user_themes_test' };
    }
}

describe('ThemesController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const mockUser = { id: 'user_themes_test' };

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

        // Clean up previous runs (be careful with foreign keys from Restaurants)
        // Ensure no restaurants exist for this user first
        await prisma.restaurant.deleteMany({ where: { ownerId: mockUser.id } });
        await prisma.restaurantTheme.deleteMany({ where: { ownerId: mockUser.id } });
    });

    afterAll(async () => {
        if (prisma) {
            // Cleanup
            await prisma.restaurantTheme.deleteMany({ where: { ownerId: mockUser.id } });
            await prisma.$disconnect();
        }
        await app.close();
    });

    it('/restaurant-theme (POST) - should create a theme', async () => {
        const createDto = {
            color: '#FF0000'
        };

        const response = await request(app.getHttpServer())
            .post('/restaurant-theme')
            .set('Authorization', 'Bearer mock_token')
            .send(createDto)
            .expect(201);

        expect(response.body.color).toBe('#FF0000');
        expect(response.body.id).toBeDefined();
    });

    it('/restaurant-theme (GET) - should list themes', async () => {
        const response = await request(app.getHttpServer())
            .get('/restaurant-theme')
            .set('Authorization', 'Bearer mock_token')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const found = response.body.find(t => t.color === '#FF0000');
        expect(found).toBeDefined();
    });
});
