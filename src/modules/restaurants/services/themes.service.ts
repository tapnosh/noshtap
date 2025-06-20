import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateThemeDto } from '../dto/create-theme.dto';
import { RestaurantTheme } from '@prisma/client';


@Injectable()
export class ThemesService {
  constructor(private prisma: PrismaService) { }

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
