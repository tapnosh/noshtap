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
import { PublicQrController } from "./controllers/public/public-qr.controller";
import { QrService } from "./services/qr.service";
import { ConfigModule } from "@nestjs/config";
import { PublicCategoriesController } from "./controllers/public/public-categories.controller";
import { PublicRestaurantsController } from "./controllers/public/public-restaurants.controller";
import { PublicMenusController } from "./controllers/public/public-menus.controller";

const privateControllers = [
  RestaurantsController,
  CategoriesController,
  ThemesController,
  MenusController,
];

const publicControllers = [
  PublicRestaurantsController,
  PublicCategoriesController,
  PublicQrController,
  PublicMenusController,
];

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [
    ...privateControllers,
    ...publicControllers,
  ],
  providers: [RestaurantsService, CategoriesService, ThemesService, MenusService, QrService],
  exports: [RestaurantsService, CategoriesService, ThemesService, MenusService, QrService],
})
export class RestaurantsModule { }
