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

@Module({
  imports: [PrismaModule],
  controllers: [RestaurantsController, CategoriesController, ThemesController, MenusController],
  providers: [RestaurantsService, CategoriesService, ThemesService, MenusService],
  exports: [RestaurantsService, CategoriesService, ThemesService, MenusService],
})
export class RestaurantsModule { }
