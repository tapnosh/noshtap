import { Module } from '@nestjs/common';
import { RestaurantsModule } from './modules/restaurants/restaurants.modules';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [RestaurantsModule, PrismaModule],
})
export class AppModule { }
