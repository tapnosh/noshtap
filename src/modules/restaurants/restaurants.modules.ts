import { PrismaModule } from "src/prisma/prisma.module";
import { RestaurantsController } from "./controllers/restaurants.controller";
import { RestaurantsService } from "./services/restaurants.service";
import { Module } from "@nestjs/common";
import { CategoriesController } from "./controllers/categories.controller";
import { CategoriesService } from "./services/categories.service";
import { ThemesController } from "./controllers/themes.controller";
import { ThemesService } from "./services/themes.service";
import { MenusService } from "./services/menus.service";
import { MenusController } from "./controllers/menus.controller";
import { QrController } from "./controllers/qr.controller";
import { QrService } from "./services/qr.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [RestaurantsController, CategoriesController, ThemesController, MenusController, QrController],
  providers: [RestaurantsService, CategoriesService, ThemesService, MenusService, QrService],
  exports: [RestaurantsService, CategoriesService, ThemesService, MenusService, QrService],
})
export class RestaurantsModule { }
