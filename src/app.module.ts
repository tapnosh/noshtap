import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.modules';
import { PrismaModule } from './prisma/prisma.module';
import { ClerkClientProvider } from './providers/clerk-client.provider';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './modules/auth/clerk-auth.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RestaurantsModule, PrismaModule, AuthModule],
  providers: [ClerkClientProvider, {
    provide: APP_GUARD,
    useClass: ClerkAuthGuard,
  },
  ],
})
export class AppModule { }
