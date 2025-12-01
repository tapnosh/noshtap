import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { GooglePlacesService } from './google-places.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('places')
export class PlacesController {
  constructor(private readonly googlePlacesService: GooglePlacesService) { }

  @Get('autocomplete')
  @ApiQuery({ name: 'input', type: String, required: true })
  @ApiQuery({ name: 'sessionToken', type: String, required: false })
  async autocomplete(
    @Query('input') input: string,
    @Query('sessionToken') sessionToken?: string,
  ) {
    if (!input) {
      throw new BadRequestException('Query parameter "input" is required');
    }

    // Session token is automatically generated if not provided
    // The returned sessionToken should be used for subsequent place details calls
    return this.googlePlacesService.autocomplete(input, sessionToken);
  }

  @Get('details')
  async details(
    @Query('placeId') placeId: string,
    @Query('sessionToken') sessionToken: string,
  ) {
    if (!placeId) {
      throw new BadRequestException('Query parameter "placeId" is required');
    }

    if (!sessionToken) {
      throw new BadRequestException(
        'Query parameter "sessionToken" is required. Use the sessionToken returned from the autocomplete endpoint.',
      );
    }

    return this.googlePlacesService.getPlaceDetails(placeId, sessionToken);
  }
}


