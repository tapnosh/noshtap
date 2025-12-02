import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GooglePlacesService } from "./google-places.service";
import { PlacesController } from "./places.controller";

@Module({
  imports: [ConfigModule],
  controllers: [PlacesController],
  providers: [GooglePlacesService],
  exports: [GooglePlacesService],
})
export class PlacesModule { }


