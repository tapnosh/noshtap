import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateThemeDto } from '../dto/create-theme.dto';
import { RestaurantTheme } from '@prisma/client';
import { USER_EVENTS, UserCreatedEvent } from '../../users/users.type';

@Injectable()
export class ThemesService {
  constructor(private prisma: PrismaService) { }

  @OnEvent(USER_EVENTS.USER_CREATED)
  async handleUserCreated(userData: UserCreatedEvent) {
    try {
      console.log(`Creating default theme for user: ${userData.id}`);

      // Create a default theme with a nice blue color
      const defaultTheme = await this.prisma.restaurantTheme.create({
        data: {
          color: '#3B82F6',
          ownerId: userData.id,
        },
      });

      console.log(`Default theme created for user ${userData.id}:`, defaultTheme.id);
    } catch (error) {
      console.error(`Failed to create default theme for user ${userData.id}:`, error);
    }
  }


  async findAll(): Promise<RestaurantTheme[]> {
    return this.prisma.restaurantTheme.findMany();
  }

  async create(dto: CreateThemeDto, userId: string) {
    return this.prisma.restaurantTheme.create({
      data: {
        color: dto.color,
        ownerId: userId,
      },
    });
  }
}
