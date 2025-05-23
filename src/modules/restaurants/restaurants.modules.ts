import { PrismaModule } from "src/prisma/prisma.module";
import { RestaurantsController } from "./controllers/restaurants.controller";
import { RestaurantsService } from "./services/restaurants.service";
import { Module } from "@nestjs/common";
import { CategoriesController } from "./controllers/categories.controller";
import { CategoriesService } from "./services/categories.service";

@Module({
  imports: [PrismaModule],
  controllers: [RestaurantsController, CategoriesController],
  providers: [RestaurantsService, CategoriesService],
  exports: [RestaurantsService, CategoriesService],
})
export class RestaurantsModule { }
