import { PrismaModule } from "src/prisma/prisma.module";
import { RestaurantsController } from "./controllers/restaurants.controller";
import { RestaurantsService } from "./services/restaurants.service";
import { Module } from "@nestjs/common";
import { CategoriesController } from "./controllers/categories.controller";
import { CategoriesService } from "./services/categories.service";
import { ThemesController } from "./controllers/themes.controller";
import { ThemesService } from "./services/themes.service";

@Module({
  imports: [PrismaModule],
  controllers: [RestaurantsController, CategoriesController, ThemesController],
  providers: [RestaurantsService, CategoriesService, ThemesService],
  exports: [RestaurantsService, CategoriesService, ThemesService],
})
export class RestaurantsModule { }
