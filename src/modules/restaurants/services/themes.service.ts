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
    await this.createDefaultTheme(userData.id);
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

  private async createDefaultTheme(userId: string) {
    return this.prisma.restaurantTheme.create({
      data: {
        color: '#3B82F6',
        ownerId: userId,
      },
    });
  }
}
