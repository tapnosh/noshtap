import { Module } from '@nestjs/common';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ThemesController],
  providers: [ThemesService, PrismaService],
})
export class ThemesModule {}
