import { Module } from '@nestjs/common';
import { RestaurantsModule } from './modules/restaurants/restaurants.modules';
import { PrismaModule } from './prisma/prisma.module';
import { ThemesModule } from './modules/themes/themes.module';

@Module({
  imports: [RestaurantsModule, PrismaModule, ThemesModule],
})
export class AppModule { }
