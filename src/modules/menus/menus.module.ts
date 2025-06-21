import { Module } from "@nestjs/common";
import { MenusController } from './controllers/menus.controller';
import { MenusService } from './services/menus.service';
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    controllers: [MenusController],
    providers: [MenusService, PrismaService]
})
export class MenusModule {}